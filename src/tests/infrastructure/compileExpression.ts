export function compileExpression<TValue, TReturn>(expression: (value: TValue) => TReturn, value: TValue | null): [value: TReturn | null, message: string] {
  const expressionValue = value ? expression(value) : null;
  const message = getExpressionPropertiesPath(expression);
  return [expressionValue, message];
}

function getExpressionPropertiesPath<TValue, TReturn>(expression: (value: TValue) => TReturn): string {
  const functionString = expression.toString();
  return functionString.slice(functionString.indexOf(">") + 2);
}
