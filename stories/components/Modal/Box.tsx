import React, {forwardRef} from 'react';
import useStyles from 'freyja';
import {titleCase} from './utils';

const layout = {
  row: {
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  table: {
    display: 'table',
    ' > *': {
      display: 'table-row',
      varticalAlign: 'middle',
    },
    ' > * > *': {
      display: 'table-cell',
      varticalAlign: 'middle',
    },
  },
  inline: {
    display: 'inline-block',
  },
};

const styles = (
  {tone, scale},
  {
    width,
    align,
    justify,
    wrap,
    row,
    split,
    space,
    self,
    selfH,
    selfV,
    separator,
    stripe,
    fill,
    grow,
    stick,
    relative,
    table,
    inline,
    clickable,
  }
) => ({
  container: {
    ...layout[table ? 'table' : row ? 'row' : inline ? 'inline' : 'column'],
    maxWidth: width,
    width: width && '100%',
    margin: width && '0 auto',
    cursor: clickable && 'pointer',
    flex: grow && `${+grow} 0`,
    justifyContent: justify || (split ? 'space-between' : 'flex-start'),
    alignItems: align || (row ? 'center' : 'stretch'),
    flexWrap: wrap && 'wrap',
    paddingLeft: scale[selfH || self] || selfH || self,
    paddingRight: scale[selfH || self] || selfH || self,
    paddingTop: scale[selfV || self] || selfV || self,
    paddingBottom: scale[selfV || self] || selfV || self,
    position: stick ? 'fixed' : relative ? 'relative' : undefined,
    top: !stick || stick === 'bottom' ? undefined : 0,
    left: !stick || stick === 'right' ? undefined : 0,
    right: !stick || stick === 'left' ? undefined : 0,
    bottom: !stick || stick === 'top' ? undefined : 0,
    zIndex: stick ? 1 : undefined,
    ' > *:not(_)': {
      flex: fill && '1 0',
      alignSelf: fill && 'stretch',
    },
    ' > *:nth-child(even)': {
      boxShadow: stripe && `inset 100px 100px rgba(125,125,125,0.05)`,
    },
    ' > * + *:not(_)': {
      borderStyle: 'solid',
      borderColor: tone[separator],
      [row ? 'marginLeft' : 'marginTop']: scale[space],
      [row ? 'borderLeftWidth' : 'borderTopWidth']: separator && 2,
    },
    [` > * + * > ${table ? '*' : 'td'}`]: {
      borderStyle: 'solid',
      borderColor: tone[separator],
      [row ? 'paddingLeft' : 'paddingTop']: scale[space],
      [row ? 'borderLeftWidth' : 'borderTopWidth']: separator && 2,
    },
  },
});

const Box = (
  {
    id,
    className = '',
    interactive,
    children,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDrag,
    onDragStart,
    onDragEnd,
    onFocus,
    onBlur,
    draggable,
    spreadProps,
    title,
    selectorPrefix = 'box',
    component: Comp = 'div',
    ...props
  },
  ref
) => (
  <Comp
    id={id}
    ref={ref}
    title={title && titleCase(title)}
    draggable={draggable}
    tabIndex={interactive ? 1 : null}
    onClick={onClick}
    onMouseOver={onMouseEnter}
    onMouseOut={onMouseLeave}
    onFocus={onFocus}
    onBlur={onBlur}
    onDrag={onDrag}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    className={`${className} ${useStyles(styles, props).container}`}
    {...spreadProps}
    data-test={(title || id) && `${selectorPrefix}:${title || id}`}
  >
    {children}
  </Comp>
);

export default forwardRef(Box) as any;
