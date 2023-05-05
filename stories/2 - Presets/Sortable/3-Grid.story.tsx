import React, {useState} from 'react';
import {MeasuringStrategy} from '@dnd-kit/core';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  arraySwap,
  arrayMove,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  rectSortingStrategy,
  rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  // horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

import {CSS} from '@dnd-kit/utilities';
import {makeStyles} from '@material-ui/core/styles';
import {Chip, Modal, TextField} from '@material-ui/core';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import {Sortable, Props as SortableProps} from './Sortable';
import {GridContainer /*, Modal*/} from '../../components';

export default {
  title: 'Presets/Sortable/Grid',
};

const Tag = ({id}: {id: string}) => {
  const {attributes, listeners, setNodeRef, transform, transition} =
    useSortable({id});

  const style = {
    margin: 4,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <span ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Chip label={id} />
    </span>
  );
};

export const ModalBasic = () => {
  const defaultTags: string[] = [
    '100_000',
    '200_000',
    '300_000',
    '400_000',
    '500_000',
    '600_000',
    '700_000',
    '800_000',
    '900_000',
  ];

  const [tags, setTags] = useState<string[]>([]);
  const classes = useStyles();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filter = createFilterOptions();
  const handleChange = (_event: any, newValue: string[]) => setTags(newValue);

  const handleDragEnd = (event: any) => {
    const {active, over} = event;

    if (active.id !== over.id) {
      setTags((state) => {
        const oldIndex = state.indexOf(active.id);
        const newIndex = state.indexOf(over.id);
        const rv = arrayMove(state, oldIndex, newIndex);

        console.log(JSON.stringify({rv}, null, 3));

        return rv;
      });
    }
  };

  return (
    <>
      <h1>Background heading text</h1>

      <Modal open>
        <div style={{top: '10%', left: '10%'}} className={classes.paper}>
          <h1>This is a modal</h1>

          <Autocomplete
            // {...props}
            options={defaultTags}
            value={tags}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            autoComplete
            autoHighlight
            freeSolo
            multiple
            filterSelectedOptions
            filterOptions={(options, state) => {
              const filtered = filter(options, state);
              if (
                // freeSolo &&
                state.inputValue &&
                !options.includes(state.inputValue)
              )
                filtered.push(state.inputValue);

              console.log(JSON.stringify({filtered}, null, 3));

              return filtered;
            }}
            disableCloseOnSelect
            getOptionLabel={(tag) => tag}
            renderOption={(tag) => tag}
            onChange={handleChange}
            // onBlur={freeSolo && handleBlur}
            renderInput={(params) => (
              <TextField
                {...params}
                // size={size}
                label="Select some tags"
                // prefix="foo"
                // suffix="bar"
                inputProps={{
                  ...params.inputProps,
                  // 'data-test': selector || name,
                }}
              />
            )}
            renderTags={(tags) => (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={tags} strategy={rectSortingStrategy}>
                  {tags.map((id) => (
                    <Tag key={id} id={id} />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          />
        </div>
      </Modal>
    </>
  );
};

// const props: Partial<SortableProps> = {
//   adjustScale: true,
//   Container: (props: any) => <GridContainer {...props} columns={5} />,
//   strategy: rectSortingStrategy,
//   wrapperStyle: () => ({
//     width: 70,
//     height: 70,
//   }),
// };

// export const BasicSetup = () => <Sortable {...props} />;

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// export const WithoutDragOverlay = () => (
//   <Sortable {...props} useDragOverlay={false} />
// );

// export const LargeFirstTile = () => (
//   <Sortable
//     {...props}
//     getItemStyles={({index}) => {
//       if (index === 0) {
//         return {
//           fontSize: '2rem',
//           padding: '36px 40px',
//         };
//       }

//       return {};
//     }}
//     wrapperStyle={({index}) => {
//       if (index === 0) {
//         return {
//           height: 288,
//           gridRowStart: 'span 2',
//           gridColumnStart: 'span 2',
//         };
//       }

//       return {
//         width: 140,
//         height: 140,
//       };
//     }}
//   />
// );

// export const VariableSizes = () => (
//   <Sortable
//     {...props}
//     itemCount={14}
//     getItemStyles={({index}) => {
//       if (index === 0 || index === 9) {
//         return {
//           fontSize: '2rem',
//           padding: '36px 40px',
//         };
//       }

//       return {};
//     }}
//     wrapperStyle={({index}) => {
//       if (index === 0 || index === 9) {
//         return {
//           height: 288,
//           gridRowStart: 'span 2',
//           gridColumnStart: 'span 2',
//         };
//       }

//       return {
//         width: 140,
//         height: 140,
//       };
//     }}
//   />
// );

// export const DragHandle = () => <Sortable {...props} handle />;

// export const ScrollContainer = () => (
//   <div
//     style={{
//       height: '50vh',
//       margin: '0 auto',
//       overflow: 'auto',
//     }}
//   >
//     <Sortable {...props} />
//   </div>
// );

// export const Swappable = () => (
//   <Sortable
//     {...props}
//     strategy={rectSortingStrategy}
//     reorderItems={arraySwap}
//     getNewIndex={({id, items, activeIndex, overIndex}) =>
//       arraySwap(items, activeIndex, overIndex).indexOf(id)
//     }
//   />
// );

// export const PressDelay = () => (
//   <Sortable
//     {...props}
//     activationConstraint={{
//       delay: 250,
//       tolerance: 5,
//     }}
//   />
// );

// export const MinimumDistance = () => (
//   <Sortable
//     {...props}
//     activationConstraint={{
//       distance: 15,
//     }}
//   />
// );

// export const RemovableItems = () => {
//   const animateLayoutChanges: AnimateLayoutChanges = (args) =>
//     defaultAnimateLayoutChanges({...args, wasDragging: true});

//   return (
//     <Sortable
//       {...props}
//       animateLayoutChanges={animateLayoutChanges}
//       measuring={{droppable: {strategy: MeasuringStrategy.Always}}}
//       removable
//       handle
//     />
//   );
// };
