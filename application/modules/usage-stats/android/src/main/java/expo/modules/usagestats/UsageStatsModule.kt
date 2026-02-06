package expo.modules.usagestats

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Process
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.Calendar

class UsageStatsModule : Module() {

    override fun definition() = ModuleDefinition {

        Name("UsageStats")

        // ── checkUsageAccess ─────────────────────────────────────────────
        // Returns true when PACKAGE_USAGE_STATS is granted for this app.
        AsyncFunction("checkUsageAccess") {
            val context = appContext.reactContext ?: return@AsyncFunction false
            hasUsageAccess(context)
        }

        // ── openUsageAccessSettings ──────────────────────────────────────
        // Opens the system "Usage Access" settings screen.
        AsyncFunction("openUsageAccessSettings") {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            val activity = appContext.currentActivity
            if (activity != null) {
                activity.startActivity(intent)
            } else {
                val ctx = appContext.reactContext ?: return@AsyncFunction
                ctx.startActivity(intent)
            }
        }

        // ── getUsageStats ────────────────────────────────────────────────
        // Queries per-app foreground time for "day" (since midnight) or "week".
        // Returns a list sorted by totalTimeInForeground descending.
        AsyncFunction("getUsageStats") { range: String ->
            val context = appContext.reactContext
                ?: return@AsyncFunction emptyList<Map<String, Any?>>()

            if (!hasUsageAccess(context)) {
                return@AsyncFunction emptyList<Map<String, Any?>>()
            }

            val usm = context.getSystemService(Context.USAGE_STATS_SERVICE)
                as? UsageStatsManager
                ?: return@AsyncFunction emptyList<Map<String, Any?>>()

            val cal = Calendar.getInstance()
            val endTime = cal.timeInMillis

            when (range) {
                "week" -> cal.add(Calendar.DAY_OF_YEAR, -7)
                else -> {
                    // "day" → from midnight today
                    cal.set(Calendar.HOUR_OF_DAY, 0)
                    cal.set(Calendar.MINUTE, 0)
                    cal.set(Calendar.SECOND, 0)
                    cal.set(Calendar.MILLISECOND, 0)
                }
            }
            val startTime = cal.timeInMillis

            val stats = usm.queryUsageStats(
                UsageStatsManager.INTERVAL_BEST,
                startTime,
                endTime
            ) ?: emptyList()

            // Aggregate across multiple intervals for the same package
            val aggregated = mutableMapOf<String, Long>()
            val lastUsed = mutableMapOf<String, Long>()

            for (stat in stats) {
                if (stat.totalTimeInForeground > 0) {
                    val pkg = stat.packageName
                    aggregated[pkg] = (aggregated[pkg] ?: 0L) + stat.totalTimeInForeground
                    lastUsed[pkg] = maxOf(lastUsed[pkg] ?: 0L, stat.lastTimeUsed)
                }
            }

            val pm = context.packageManager

            aggregated.entries
                .sortedByDescending { it.value }
                .map { (pkg, time) ->
                    val appName: String? = try {
                        @Suppress("DEPRECATION")
                        val ai = pm.getApplicationInfo(pkg, 0)
                        pm.getApplicationLabel(ai).toString()
                    } catch (_: PackageManager.NameNotFoundException) {
                        null
                    }
                    mapOf<String, Any?>(
                        "packageName" to pkg,
                        "totalTimeInForeground" to time.toDouble(),
                        "lastTimeUsed" to (lastUsed[pkg] ?: 0L).toDouble(),
                        "appName" to appName
                    )
                }
        }
    }

    // ── helpers ──────────────────────────────────────────────────────────
    private fun hasUsageAccess(context: Context): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as? AppOpsManager
            ?: return false
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }
}
