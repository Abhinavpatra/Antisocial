import { NextResponse } from 'next/server';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function jsonOk(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function jsonError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { ok: false, error: { message: error.message, details: error.details } },
      { status: error.status },
    );
  }

  const message = error instanceof Error ? error.message : 'Unknown error';
  return NextResponse.json({ ok: false, error: { message } }, { status: 500 });
}

