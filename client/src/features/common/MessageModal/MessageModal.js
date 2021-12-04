import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from './modalSlice';

/* This modal can be used as a substitute to alert() to avoid the ESLint warning
To use this component:
  1. import [dispatch | showModal | hideModal | MessageModal] as needed
  2. include MessageModal as part of a component
  3. use the following code to set the state of modal
    const dispatch = useDispatch();
    dispatch(showModal({ headerText: 'ABC', bodyText: 'XYZ' }));  // show modal
    dispatch(hideModal());                                        // hide modal
*/
export function MessageModal() {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  return (
    <Modal show={modalState.isVisible} onHide={() => dispatch(hideModal())}>
      <Modal.Header>
        <Modal.Title>{modalState.headerText}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalState.bodyText}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(hideModal())}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
