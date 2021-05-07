/**
 * Lift method for promise
 * @param method
 */
export const liftPromise = <TInput, TOutput>(
  method: (input: TInput) => TOutput
) => async (promise: Promise<TInput>): Promise<TOutput> => promise.then(method);

export const bindPromise = <TInput, TOutput>(
  method: (input: TInput) => Promise<TOutput>
) => async (promise: Promise<TInput>): Promise<TOutput> => promise.then(method);
