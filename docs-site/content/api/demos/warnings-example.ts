import { warningHandler } from 'regor'

// Installing a handler affects all Regor apps using this module instance.
export function installWarningHandler(handler: typeof warningHandler.warning) {
  const previous = warningHandler.warning
  warningHandler.warning = handler
  return () => {
    warningHandler.warning = previous
  }
}
