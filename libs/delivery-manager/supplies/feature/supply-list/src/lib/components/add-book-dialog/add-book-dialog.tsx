import { Category } from '@e-commerce/shared/api-models';
import { useState } from 'react';
import 'cally';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import AddBookDialogCategoryForm from './add-book-dialog-category-form/add-book-dialog-category-form';
import AddInventoryFormDialog from './add-book-dialog-inventory-form/add-book-dialog-inventory-form';

export type FormType = 'inventory' | 'category';

export const AddBookDialog = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [whichForm, setWhichForm] = useState<FormType>('inventory');

  const [category, setCategory] = useState<Category | null>(null);

  const onCategoryAdded = (category?: Category) => {
    if (category) {
      setCategory(category);
    }
    setWhichForm('inventory');
  };

  return (
    <>
      <Button
        className="btn btn-primary h-fit min-w-max"
        onClick={() => setIsDialogVisible(true)}
        label="Add book"
      />

      <Dialog
        visible={isDialogVisible}
        header="Add book"
        onHide={() => setIsDialogVisible(false)}
        className="max-w-[648px] w-full"
      >
        {whichForm === 'inventory' && (
          <AddInventoryFormDialog
            setField={{ key: 'category', value: category }}
            onChangeForm={(formType) => setWhichForm(formType)}
            onClose={() => setIsDialogVisible(false)}
          />
        )}
        {whichForm === 'category' && (
          <AddBookDialogCategoryForm
            onClose={(category) => onCategoryAdded(category)}
          />
        )}
      </Dialog>
    </>
  );
};

export default AddBookDialog;
