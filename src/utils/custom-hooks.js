/* eslint-disable no-console */
import { useReducer, useCallback, useRef, useMemo, useEffect } from 'react';

export function useCustomReducer(reducerFn, initialState) {
  const [state, dispatch] = useReducer(reducerFn, initialState);
  const stateRef = useRef();
  const customDispatch = useCallback(action => {
    if (typeof action === 'function') {
      return action(customDispatch, () => stateRef.current.state);
    }

    if (action.type) {
      stateRef.current.prevState = stateRef.current.state;
      stateRef.current.action = action;
      dispatch(action);
      return undefined;
    }
  }, []);

  useMemo(() => {
    if (stateRef.current && stateRef.current.action && stateRef.current.prevState) {
      const current = { ...stateRef.current };
      console.groupCollapsed(
        `%c action %c${current.action.type} %c@`,
        'color:#81c784;font-weight:normal;',
        'font-weight:bold;',
        'color:#7F7F7F;font-weight:normal;'
      );
      console.log('%c prev state', 'color:#9C9D9D;font-weight:bold;', current.prevState);
      console.log('%c action    ', 'color:#0092FF;font-weight:bold;', current.action);
      console.log('%c next state', 'color:#15C050;font-weight:bold;', state);
      console.groupEnd();
    }
    stateRef.current = {};
  }, [state]);

  stateRef.current.state = state;
  return [state, customDispatch];
}

export function useEventListener(eventName, handler, element = document) {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return false;

    const eventListener = event => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);
    return () => element.removeEventListener(eventName, eventListener);
  }, [eventName, element]);
}

export function useWhyDidYouUpdate(name, props) {
  const previousProps = useRef();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changesObj = {};
      allKeys.forEach(key => {
        if (previousProps.current[key] !== props[key]) {
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key]
          };
        }
      });

      if (Object.keys(changesObj).length) {
        console.log('[why-did-you-update]', name, changesObj);
      }
    }

    previousProps.current = props;
  });
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
