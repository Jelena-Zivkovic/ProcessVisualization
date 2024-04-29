export type FunctionInfo = {
  [functionName: string]: {
    parameters: ("number" | "string" | "boolean")[];
    returnType: string;
    execute: (...args: ("string" | "number" | "boolean")[]) => any;
  };
};
