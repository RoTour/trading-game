export interface UseCase<Input = void, Output = void> {
	execute: (input: Input) => Output;
}

export interface AsyncUseCase<Input = void, Output = void> {
	execute: (input: Input) => Promise<Output>;
}