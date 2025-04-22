import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';
import { Author, Inventory } from '@e-commerce/shared/api-models';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRef, useState } from 'react';
import 'cally';
import { Autocomplete } from '@e-commerce/delivery-manager/shared/ui';

export const AddBookDialog = () => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const toast = useToastStore();
  const [date, setDate] = useState<Date | undefined>();
  const [authorSearchText, setAuthorSearchText] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  const {} = useMutation<void, Error, Inventory>({
    mutationFn: () => axios.post(`${import.meta.env.VITE_API_URL}/inventories`),
  });

  const { data: authors, refetch } = useQuery<Author[]>({
    queryKey: [authorSearchText],
    queryFn: async () => {
      const response = await axios.get<Author[]>(
        `${import.meta.env.VITE_API_URL}/authors`,
        {
          params: { nameLike: authorSearchText },
        },
      );

      return response.data;
    },
  });

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <button className="btn btn-primary" onClick={openDialog}>
        Add book
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box rounded-base flex flex-col gap-8 max-w-[648px]">
          <div className="flex flex-col gap-base">
            <div className="flex items-center">
              <h3 className="text-center text-xl mx-auto">Update quantity</h3>
              <button className="btn btn-ghost seft-end" onClick={closeDialog}>
                <span className="pi pi-times"></span>
              </button>
            </div>
            <div className="w-full h-px bg-neutral-content"></div>
          </div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">What is the book title?</legend>
            <input type="text" className="input" placeholder="Type title" />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">What is the book price?</legend>
            <input type="number" className="input" placeholder="Type price" />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">How many pages?</legend>
            <input type="number" className="input" placeholder="Type page" />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">What are the authors?</legend>
            <Autocomplete
              items={authors ?? []}
              getLabel={(item: Author) => item.name}
              onItemSelect={(event) => setSelectedAuthor(event)}
              onTextChange={() => refetch()}
            />
          </fieldset>

          {
            // <fieldset className="fieldset">
            //   <legend className="fieldset-legend">
            //     When the book was or will be published?
            //   </legend>
            //   <button
            //     popovertarget="cally-popover1"
            //     className="input input-border"
            //     id="cally1"
            //   >
            //     Pick a date
            //   </button>
            //   <div
            //     popover={''}
            //     id="cally-popover1"
            //     className="dropdown bg-base-100 rounded-box shadow-lg"
            //   >
            //     <calendar-date
            //       class="cally"
            //       onchange={(event) => {
            //         document.getElementById('cally1').innerText =
            //           event.target.value;
            //       }}
            //     >
            //       <svg
            //         aria-label="Previous"
            //         className="fill-current size-4"
            //         slot="previous"
            //         xmlns="http://www.w3.org/2000/svg"
            //         viewBox="0 0 24 24"
            //       >
            //         <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
            //       </svg>
            //       <svg
            //         aria-label="Next"
            //         className="fill-current size-4"
            //         slot="next"
            //         xmlns="http://www.w3.org/2000/svg"
            //         viewBox="0 0 24 24"
            //       >
            //         <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
            //       </svg>
            //       <calendar-month></calendar-month>
            //     </calendar-date>
            //   </div>
            // </fieldset>
            //
            // <fieldset className="fieldset">
            //   <legend className="fieldset-legend">What is the publisher?</legend>
            //   <input type="text" className="input" placeholder="Type publisher" />
            // </fieldset>
            //
            // <fieldset className="fieldset">
            //   <legend className="fieldset-legend">What is the category?</legend>
            //   <input type="text" className="input" placeholder="Type category" />
            // </fieldset>
            //
            // <fieldset className="fieldset">
            //   <legend className="fieldset-legend">What is the tag?</legend>
            //   <input type="text" className="input" placeholder="Select tag" />
            // </fieldset>
          }
        </div>
      </dialog>
    </>
  );
};

export default AddBookDialog;
