/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'react' {
  // React Types
  type ReactNode = any;
  type ReactElement = any;
  type ComponentType<P = {}> = React.ComponentClass<P> | React.FunctionComponent<P>;
  
  // React Hooks
  export function useState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>];
  export function useState<S = undefined>(): [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>];
  export function useEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function useReducer<R extends React.Reducer<any, any>>(
    reducer: R,
    initialState: React.ReducerState<R>,
    initializer?: undefined
  ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
  export function useMemo<T>(factory: () => T, deps: React.DependencyList | undefined): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: React.DependencyList): T;
  export function useRef<T>(initialValue: T): React.MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): React.RefObject<T>;
  export function useRef<T = undefined>(): React.MutableRefObject<T | undefined>;
  
  // Event Types
  interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }
  
  interface SyntheticEvent<T = Element, E = Event> {
    bubbles: boolean;
    currentTarget: EventTarget & T;
    target: EventTarget & T;
    preventDefault(): void;
    stopPropagation(): void;
  }
  
  // Dispatch Types
  type Dispatch<A> = (value: A) => void;
  type SetStateAction<S> = S | ((prevState: S) => S);
  
  // Effect Types
  type EffectCallback = () => (void | (() => void | undefined));
  type DependencyList = ReadonlyArray<any>;
  
  // Context Types
  interface Context<T> {
    Provider: React.ComponentType<{ value: T; children?: React.ReactNode }>;
    Consumer: React.ComponentType<{ children: (value: T) => React.ReactNode }>;
  }
  
  // Reducer Types
  type Reducer<S, A> = (prevState: S, action: A) => S;
  type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
  type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
  
  // Ref Types
  interface MutableRefObject<T> {
    current: T;
  }
  interface RefObject<T> {
    readonly current: T | null;
  }
  
  // Component Types
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): React.ReactElement | null;
  }
  type FC<P = {}> = FunctionComponent<P>;
  
  interface ComponentClass<P = {}, S = {}> {
    new (props: P, context?: any): React.Component<P, S>;
  }
  
  class Component<P = {}, S = {}> {
    constructor(props: P, context?: any);
    render(): React.ReactNode;
  }
  
  // HTML Attributes
  interface HTMLAttributes<T> {
    className?: string;
    key?: string | number;
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<T>) => void;
    onChange?: (event: React.ChangeEvent<T>) => void;
    [key: string]: any;
  }
  
  interface DetailedHTMLProps<E, T> extends HTMLAttributes<T> {}
  
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    name?: string;
    value?: string | number;
    placeholder?: string;
    type?: string;
  }
  
  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: 'button' | 'submit' | 'reset';
  }
  
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    src?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
  }
  
  interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
    href?: string;
    target?: string;
    rel?: string;
  }
  
  interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    action?: string;
    method?: string;
  }
  
  interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
    value?: string | number;
  }
  
  interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
    cellPadding?: number | string;
    cellSpacing?: number | string;
    summary?: string;
  }
  
  interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
    abbr?: string;
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
    scope?: string;
  }
  
  interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
    abbr?: string;
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
  }
  
  interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string;
  }
  
  // Mouse Event
  interface MouseEvent<T = Element> extends SyntheticEvent<T, MouseEvent> {
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h5: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h6: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      strong: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      em: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      br: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
      img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
      a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      footer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      article: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      aside: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
      ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
      ol: React.DetailedHTMLProps<React.HTMLAttributes<HTMLOListElement>, HTMLOListElement>;
      li: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
      table: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
      thead: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      tbody: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
      th: React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
      td: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
      blockquote: React.DetailedHTMLProps<React.BlockquoteHTMLAttributes<HTMLElement>, HTMLElement>;
      code: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      pre: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
    }
  }
}

declare module 'next/image' {
  import React from 'react';
  
  interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    quality?: number;
    placeholder?: 'blur' | 'empty';
    style?: React.CSSProperties;
    [key: string]: any;
  }
  
  const Image: React.FC<ImageProps>;
  export default Image;
}

declare module 'next/link' {
  import React from 'react';
  
  interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    children: React.ReactNode;
    [key: string]: any;
  }
  
  const Link: React.FC<LinkProps>;
  export default Link;
}

// React Icons type support
declare module 'react-icons/hi' {
  import { ComponentType } from 'react';
  interface IconBaseProps {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
  }
  export const HiOutlineMail: ComponentType<IconBaseProps>;
}

declare module 'react-icons/fa' {
  import { ComponentType } from 'react';
  interface IconBaseProps {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
  }
  export const FaLinkedin: ComponentType<IconBaseProps>;
  export const FaPhoneAlt: ComponentType<IconBaseProps>;
  export const FaMapMarkerAlt: ComponentType<IconBaseProps>;
}
