/* eslint-disable no-underscore-dangle */
/* eslint-disable no-bitwise */
import * as R from 'ramda';

export const logger = R.tap(console.log);

export const isNothing = R.either(R.isEmpty, R.isNil);

export const isSomething = R.complement(isNothing);

export const isAllNothing = R.ifElse(
  R.is(Object),
  R.pipe(R.values, R.all(isNothing)),
  R.all(isNothing)
);

export const isAllSomething = R.ifElse(
  R.is(Object),
  R.pipe(R.values, R.all(isSomething)),
  R.all(isSomething)
);

export const classnames = R.curry(classNames => {
  const classes = Object.keys(R.defaultTo([], classNames)).map(c => (classNames[c] ? `${c} ` : ''));
  return classes.join('').trim();
});
