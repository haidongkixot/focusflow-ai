import prisma from '@/lib/prisma'

// --- Log Levels ---
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info'

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel]
}

function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString()
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : ''
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`
}

// --- Console Logger ---
export const logger = {
  debug(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('debug')) console.debug(formatMessage('debug', message, meta))
  },

  info(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('info')) console.info(formatMessage('info', message, meta))
  },

  warn(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('warn')) console.warn(formatMessage('warn', message, meta))
  },

  error(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('error')) console.error(formatMessage('error', message, meta))
  },
}

// --- Audit Log (persisted to DB) ---
export async function auditLog(params: {
  userId: string
  action: string
  entity: string
  entityId?: string
  details?: Record<string, string | number | boolean | null>
  ipAddress?: string
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        details: params.details ?? undefined,
        ipAddress: params.ipAddress,
      },
    })
    logger.info(`Audit: ${params.action} on ${params.entity}`, {
      userId: params.userId,
      entityId: params.entityId,
    })
  } catch (err) {
    logger.error('Failed to write audit log', {
      error: err instanceof Error ? err.message : String(err),
      ...params,
    })
  }
}

// --- Request Logger Helper ---
export function logRequest(method: string, path: string, userId?: string, durationMs?: number) {
  logger.info(`${method} ${path}`, {
    userId,
    durationMs,
  })
}

// --- Error Logger Helper ---
export function logError(error: unknown, context?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : undefined
  logger.error(message, { stack, ...context })
}

export default logger
