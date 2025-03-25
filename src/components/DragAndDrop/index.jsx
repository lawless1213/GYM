import {useSortable} from '@dnd-kit/react/sortable';

function Sortable({id, index}) {
  const {ref} = useSortable({id, index});

  return (
    <li ref={ref} className="item">Item {id}</li>
  );
}

function DragAndDrop() {
  const items = [1, 2, 3, 4];

  return (
    <ul className="list">
      {items.map((id, index) =>
        <Sortable key={id} id={id} index={index} />
      )}
    </ul>
  );
};

export default DragAndDrop;