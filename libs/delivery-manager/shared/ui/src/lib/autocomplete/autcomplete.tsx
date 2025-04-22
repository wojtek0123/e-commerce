import { FormEvent } from 'react';

interface AutocompleteProps<Item> {
  items: Item[];
  onItemSelect: (item: Item) => void;
  onTextChange: (text: string | null) => void;
  getLabel: (item: Item) => string | number;
}

export const Autocomplete = <Item,>(props: AutocompleteProps<Item>) => {
  const changeText = (event: FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;

    props.onTextChange(value);
  };

  return (
    <>
      <button
        className="btn"
        popoverTarget="popover-1"
        style={{ anchorName: '--anchor-1' } /* as React.CSSProperties */}
      >
        Button
      </button>

      <ul
        className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
        popover="auto"
        id="popover-1"
        style={{ positionAnchor: '--anchor-1' } /* as React.CSSProperties */}
      >
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
      </ul>
    </>
    // <details className="dropdown">
    //   <summary className="btn m-1">
    //     <input
    //       type="text"
    //       placeholder="Type"
    //       className="input"
    //       onChange={(event) => changeText(event)}
    //     />
    //   </summary>
    //   <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    //     {props.items.map((item) => (
    //       <li key={crypto.randomUUID()}>
    //         <button onClick={() => props.onItemSelect(item)}>
    //           {props.getLabel(item)}
    //         </button>
    //       </li>
    //     ))}
    //   </ul>
    // </details>
  );
};
