import { Author, Category, Publisher } from '@e-commerce/shared/api-models';
import { useState } from 'react';
import 'cally';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import AddBookDialogCategoryForm from './add-book-dialog-category-form/add-book-dialog-category-form';
import AddInventoryFormDialog from './add-book-dialog-inventory-form/add-book-dialog-inventory-form';
import AddBookDialogPublisherForm from './add-book-dialog-publisher-form/add-book-dialog-publisher-form';
import AddBookDialogAuthorForm from './add-book-dialog-author-form/add-book-author-form';
import { supabase } from '@e-commerce/delivery-manager/supplies/data-access';
import { useToastStore } from '@e-commerce/delivery-manager/shared/data-access';

export type FormType = 'inventory' | 'category' | 'publisher' | 'author';

export const AddBookDialog = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [whichForm, setWhichForm] = useState<FormType>('inventory');
  const toast = useToastStore();

  const [category, setCategory] = useState<Category | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);

  function onItemAdded<Item>(setItem: (item: Item) => void, item?: Item) {
    if (item) {
      setItem(item);
    }
    setWhichForm('inventory');
  }

  function onHide() {
    switch (whichForm) {
      case 'inventory':
        setIsDialogVisible(false);
        break;
      case 'category':
      case 'publisher':
      case 'author':
        setWhichForm('inventory');
        break;
    }
  }

  function onDialogHide(imageCoverUrl: string) {
    console.log('hrererer')
    deleteImageFromStorage(imageCoverUrl)
  }

  const deleteImageFromStorage = async (imageCoverUrl: string) => {
    if (!imageCoverUrl) {
      return;
    }

    const match = imageCoverUrl.match(/image-covers\/.*/);
    const path = match ? match[0] : null;

    if (!path) return;

    // setImageUploadLoading(true)

    const { error, data } = await supabase.storage
      .from('image-covers')
      .remove([path.split('?')[0].split('/')[1]]);

    if (error) {
      toast.show({
        summary: 'Error',
        detail: error.message ?? 'Error occurred while deleting the image',
        severity: 'success',
      });

      // setImageUploadLoading(false)
      return;
    }

    if (!data) return;

    toast.show({
      summary: 'Success',
      detail: 'Image has been deleted',
      severity: 'success',
    });
    // setImageUploadLoading(false)
    // setImageCoverUrl(null)
  }

  return (
    <>
      <Button
        className="btn btn-primary h-fit min-w-max"
        onClick={() => setIsDialogVisible(true)}
        label="Add book"
      />

      <Dialog
        visible={isDialogVisible}
        header={`Add ${whichForm === 'inventory' ? 'book' : whichForm}`}
        onHide={onHide}
        className="max-w-[648px] w-full"
      >
        <div className={`${whichForm === 'inventory' ? '' : 'hidden'}`}>
          <AddInventoryFormDialog
            isFormVisible={whichForm === 'inventory'}
            setFields={[
              { key: 'category', value: category },
              { key: 'publisher', value: publisher },
            ]}
            onChangeForm={(formType) => setWhichForm(formType)}
            onClose={() => setIsDialogVisible(false)}
            onUnmount={(imageCoverUrl) => onDialogHide(imageCoverUrl)}
          />
        </div>
        {whichForm === 'category' && (
          <AddBookDialogCategoryForm
            onClose={(category) => onItemAdded(setCategory, category)}
          />
        )}
        {whichForm === 'publisher' && (
          <AddBookDialogPublisherForm
            onClose={(publisher) => onItemAdded(setPublisher, publisher)}
          />
        )}
        {whichForm === 'author' && (
          <AddBookDialogAuthorForm onClose={() => setWhichForm('inventory')} />
        )}
      </Dialog>
    </>
  );
};

export default AddBookDialog;
