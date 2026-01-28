# Requirements Document

## Introduction

The Social Time Tracker is a mobile application that combines personal time tracking capabilities with social gamification features. Users can monitor their app usage patterns while engaging with friends through leaderboards, challenges, and achievement systems. The app promotes healthy digital habits through social accountability and competitive elements.

## Glossary

- **Time_Tracker**: The core system component that monitors and records app usage data
- **User**: A registered individual with a unique username who uses the application
- **Friend**: Another User who has been added to a User's social network within the app
- **Challenge**: A time-based goal that Users can create, accept, or participate in
- **Leaderboard**: A ranked display of Users based on their app usage metrics
- **Badge**: A digital achievement awarded to Users for completing Challenges or reaching milestones
- **Usage_Data**: Time-based metrics collected about User interactions with mobile applications
- **Popular_App**: Commonly tracked applications like Instagram, WhatsApp, YouTube, etc.
- **Coin**: Virtual currency earned by completing Challenges and lost when forfeiting them
- **Challenge_Overlay**: A blocking screen that appears when Users attempt to access restricted apps during active Challenges
- **Admin**: System administrator who can create and manage Popular Challenges
- **Global_Ranking**: System-wide leaderboard based on total Coins earned by all Users

## Requirements

### Requirement 1: Time Tracking Core Functionality

**User Story:** As a user, I want to track my time spent on individual apps and overall phone usage, so that I can understand my digital consumption patterns.

#### Acceptance Criteria

1. WHEN the app is installed and permissions granted, THE Time_Tracker SHALL monitor all app usage in real-time
2. WHEN a user opens any mobile application, THE Time_Tracker SHALL record the start time and app identifier
3. WHEN a user closes or switches from an application, THE Time_Tracker SHALL calculate and store the session duration
4. THE Time_Tracker SHALL aggregate daily, weekly, and monthly usage statistics for each monitored application
5. WHEN usage data is requested, THE Time_Tracker SHALL provide accurate time measurements with minute-level precision

### Requirement 2: User Account Management

**User Story:** As a user, I want to create an account with a unique username, so that I can be identified in the social features of the app.

#### Acceptance Criteria

1. WHEN a user attempts to register, THE System SHALL require a unique username that has not been taken by another User
2. WHEN a username is submitted, THE System SHALL validate it contains only alphanumeric characters and underscores
3. WHEN a valid username is provided, THE System SHALL create a new User account and associate all usage data with that User
4. THE System SHALL maintain username uniqueness across all registered Users
5. WHEN a User logs in, THE System SHALL authenticate them using their unique username and associated credentials

### Requirement 3: Friend Management and Privacy System

**User Story:** As a user, I want to add friends via their unique usernames and control which apps are visible to them, so that I can build my social network while maintaining privacy over sensitive usage data.

#### Acceptance Criteria

1. WHEN a user searches for another user by username, THE System SHALL return matching User profiles if they exist
2. WHEN a user sends a friend request to another User, THE System SHALL create a pending friendship connection
3. WHEN a User accepts a friend request, THE System SHALL establish a bidirectional friendship relationship
4. WHEN a User views their friends list, THE System SHALL display all confirmed Friend relationships
5. THE System SHALL prevent Users from sending duplicate friend requests to the same User
6. WHEN a User selects apps to hide from friends, THE System SHALL exclude those apps from Friend leaderboards while still including their time in total usage calculations
7. THE System SHALL allow Users to modify their app privacy settings at any time

### Requirement 4: Leaderboard System

**User Story:** As a user, I want to see rankings of my friends' usage for popular apps across different time periods, so that I can compare my digital habits with others.

#### Acceptance Criteria

1. WHEN a User views a leaderboard for a Popular_App, THE System SHALL display Friend rankings based on usage time
2. THE System SHALL provide leaderboard views for three time periods: today, this past week, and this month
3. WHEN calculating rankings, THE System SHALL use total usage time for the specified app and time period
4. THE System SHALL include leaderboards for Popular_Apps including Instagram, WhatsApp, YouTube, TikTok, and Facebook
5. WHEN a User has no Friends, THE System SHALL display only their own usage statistics in leaderboard format

### Requirement 5: Challenge Creation and Enforcement System

**User Story:** As a user, I want to create challenges for any app with strict enforcement mechanisms, so that I can commit to reducing my usage with accountability measures.

#### Acceptance Criteria

1. WHEN a User creates a Challenge, THE System SHALL allow them to specify any installed app, time limit, and duration
2. WHEN a User sends a Challenge to a Friend, THE System SHALL create a Challenge invitation that the Friend can accept or decline
3. WHEN a Challenge is active and the User attempts to open the restricted app, THE System SHALL display a Challenge_Overlay blocking access
4. WHEN the Challenge_Overlay is displayed, THE System SHALL show challenge details and provide only options to return to the app or forfeit the challenge
5. WHEN a Challenge is active, THE System SHALL prevent app uninstallation to maintain challenge integrity
6. WHEN a Challenge period ends successfully, THE System SHALL award Coins and notify the User with haptic feedback and celebratory audio
7. WHEN a User forfeits a Challenge, THE System SHALL deduct Coins and provide negative haptic feedback

### Requirement 6: Popular Challenges and Admin Management

**User Story:** As a user, I want to participate in trending challenges created by administrators, so that I can join curated community challenges for better digital wellness.

#### Acceptance Criteria

1. WHEN an Admin creates a Popular Challenge, THE System SHALL make it available to all Users
2. WHEN a User joins a Popular Challenge, THE System SHALL apply the same enforcement mechanisms as personal challenges
3. THE System SHALL include trending challenges such as "YouTube 2 hour fast", "WhatsApp 1 minute limit", and "Instagram detox day"
4. WHEN multiple Users participate in the same Popular Challenge, THE System SHALL create a shared leaderboard for that Challenge
5. THE System SHALL update Popular Challenge rankings in real-time as Users complete or fail challenges
6. WHEN Popular Challenges are completed, THE System SHALL award standardized Coin amounts set by the Admin

### Requirement 7: Coin System and Global Rankings

**User Story:** As a user, I want to earn coins for completing challenges and see global rankings, so that I can be rewarded for my achievements and compete with users worldwide.

#### Acceptance Criteria

1. WHEN a User successfully completes any Challenge, THE System SHALL award them Coins based on challenge difficulty and duration
2. WHEN a User forfeits a Challenge, THE System SHALL deduct Coins from their total balance
3. THE System SHALL maintain a Global_Ranking leaderboard based on total Coins earned by all Users
4. WHEN Coins are awarded, THE System SHALL provide positive haptic feedback and play celebratory audio effects
5. WHEN Coins are deducted, THE System SHALL provide negative haptic feedback and appropriate audio cues
6. THE System SHALL prevent User Coin balances from going below zero
7. WHEN a User views global rankings, THE System SHALL display their current position among all Users

### Requirement 8: Badge and Achievement System

**User Story:** As a user, I want to earn badges for completing challenges and reaching milestones, so that I can showcase my achievements and stay motivated.

#### Acceptance Criteria

1. WHEN a User successfully completes any Challenge, THE System SHALL award them a corresponding Badge in addition to Coins
2. THE System SHALL maintain different Badge types for various Challenge categories and difficulty levels
3. WHEN a User views their profile, THE System SHALL display all earned Badges with timestamps
4. THE System SHALL prevent duplicate Badge awards for the same Challenge completion
5. WHEN a User earns a new Badge, THE System SHALL notify them immediately upon Challenge completion

### Requirement 9: Challenge Overlay and App Protection

**User Story:** As a user, I want the app to strictly enforce my challenges by blocking access to restricted apps, so that I cannot easily break my commitments.

#### Acceptance Criteria

1. WHEN a Challenge is active and the User opens a restricted app, THE System SHALL immediately display a Challenge_Overlay covering the entire screen
2. THE Challenge_Overlay SHALL be unmovable and prevent access to the underlying app functionality
3. WHEN the Challenge_Overlay is displayed, THE System SHALL show challenge progress, remaining time, and motivational messaging
4. THE Challenge_Overlay SHALL provide only two options: return to the Social Time Tracker app or forfeit the challenge
5. WHEN a Challenge is active, THE System SHALL prevent uninstallation of both the restricted app and the Social Time Tracker app
6. THE System SHALL detect attempts to bypass the overlay through system settings and maintain the block

**User Story:** As a user, I want to navigate between different sections of the app easily, so that I can access all features efficiently.

#### Acceptance Criteria

1. THE System SHALL provide a Home page displaying personal usage summary and recent activity
2. THE System SHALL provide a Leaderboard page with tabs for different Popular_Apps and time periods
3. THE System SHALL provide a Challenges page showing active challenges, popular challenges, and challenge requests
4. THE System SHALL provide a Profile page displaying user statistics, badges, friends list, and monthly usage visualization
5. WHEN a User navigates between pages, THE System SHALL maintain consistent navigation elements and load pages within 2 seconds

### Requirement 10: Navigation and User Interface

**User Story:** As a user, I want to navigate between different sections of the app with smooth transitions and intuitive design, so that I can access all features efficiently with a delightful experience.

#### Acceptance Criteria

1. THE System SHALL provide a Home page displaying personal usage summary and recent activity
2. THE System SHALL provide a Leaderboard page with tabs for different Popular_Apps and time periods
3. THE System SHALL provide a Challenges page showing active challenges, popular challenges, and challenge requests
4. THE System SHALL provide a Profile page displaying user statistics, badges, friends list, and monthly usage visualization
5. WHEN a User navigates between pages, THE System SHALL use smooth page transitions that flow from the tapped element
6. WHEN a User taps any interactive element, THE System SHALL provide immediate visual feedback with smooth animations
7. THE System SHALL maintain consistent navigation elements and load pages within 2 seconds
8. THE System SHALL display total Coins and user profile image persistently in the navigation bar
9. THE System SHALL show selected leaderboard rankings (friends or global) for the current week in the navigation area

### Requirement 11: User Experience and Feedback Systems

**User Story:** As a user, I want rich haptic and visual feedback for my actions with distinctive visual themes, so that the app feels responsive and engaging.

#### Acceptance Criteria

1. WHEN a User updates any setting or completes an action, THE System SHALL provide subtle haptic feedback
2. WHEN a User declines a challenge, THE System SHALL provide moderate haptic feedback
3. WHEN a User forfeits an active challenge, THE System SHALL provide strong haptic feedback to emphasize the negative action
4. WHEN a User successfully completes a challenge, THE System SHALL play celebratory audio effects without haptic feedback
5. WHEN Coins are awarded, THE System SHALL animate them flying from the action location to the total coin display in the navigation bar
6. THE System SHALL support both light and dark mode themes with smooth transitions between them
7. WHEN dark mode is active, THE System SHALL display a thin yellowish ring light border around the screen using color #D5B60A
8. WHEN light mode is active, THE System SHALL use the default ring light color #E8DE2A for accent elements
9. THE System SHALL animate ring lights around buttons with smooth circular transitions during interactions
10. WHEN theme changes occur, THE System SHALL maintain visual consistency across all interface elements

### Requirement 12: Data Privacy and Security

**User Story:** As a user, I want my usage data to be secure and private, so that I can trust the app with my personal information.

#### Acceptance Criteria

1. THE System SHALL encrypt all stored Usage_Data using industry-standard encryption methods
2. WHEN a User deletes their account, THE System SHALL permanently remove all associated Usage_Data within 30 days
3. THE System SHALL only share usage statistics with confirmed Friends and only in aggregate form for leaderboards
4. THE System SHALL require explicit user permission before accessing device usage statistics
5. THE System SHALL not store or transmit any personal app content, only usage duration metrics

### Requirement 13: Data Persistence and Synchronization

**User Story:** As a user, I want my data to be saved reliably and synchronized across sessions, so that I don't lose my progress and statistics.

#### Acceptance Criteria

1. WHEN Usage_Data is collected, THE System SHALL persist it to local storage immediately
2. WHEN the User has internet connectivity, THE System SHALL synchronize local data with remote servers
3. WHEN data conflicts occur during synchronization, THE System SHALL prioritize the most recent timestamp
4. THE System SHALL maintain data integrity during network interruptions and resume synchronization when connectivity returns
5. WHEN a User reinstalls the app, THE System SHALL restore their complete usage history and social connections from remote storage