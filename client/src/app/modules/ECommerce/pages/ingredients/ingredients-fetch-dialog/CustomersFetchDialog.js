import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import {
  CustomerStatusCssClasses,
  CustomerStatusTitles
} from "../IngredientsUIHelpers";
import { useCustomersUIContext } from "../IngredientsUIContext";

const selectedCustomers = (entities, ids) => {
  const _customers = [];
  ids.forEach(id => {
    const ingredient = entities.find(el => el._id === id);
    console.log("cuu", ingredient);
    if (ingredient) {
      _customers.push(ingredient);
    }
  });
  return _customers;
};

export function CustomersFetchDialog({ show, onHide }) {
  // Ingredients UI Context
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      ids: customersUIContext.ids
    };
  }, [customersUIContext]);

  // Ingredients Redux state
  const { customers } = useSelector(
    state => ({
      customers: selectedCustomers(
        state.customers.entities,
        customersUIProps.ids
      )
    }),
    shallowEqual
  );
  // if customers weren't selected we should close modal
  useEffect(() => {
    if (!customersUIProps.ids || customersUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customersUIProps.ids]);
  console.log("customrs", customers);
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Fetch selected elements
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table table table-head-custom table-vertical-center overflow-hidden">
          <thead>
            <tr>
              <th>ID</th>
              <th>STATUS</th>
              <th>CUSTOMER</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(ingredient => (
              <tr key={`id${ingredient.id}`}>
                <td>{ingredient.id}</td>
                <td>
                  <span
                    className={`label label-lg label-light-${
                      CustomerStatusCssClasses[ingredient.status]
                    } label-inline`}
                  >
                    {" "}
                    {CustomerStatusTitles[ingredient.status]}
                  </span>
                </td>
                <td>
                  <span className="ml-3">
                    {ingredient.lastName}, {ingredient.firstName}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-primary btn-elevate"
          >
            Ok
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
