import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Accordion,
  AccordionSet,
  Col,
  ExpandAllButton,
  Icon,
  Pane,
  Row,
} from '@folio/stripes/components';

import Information from './Information';
import {
  ACCORDION,
} from '../constants';

class InvoiceDetails extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    invoice: PropTypes.object,
  };

  state = {
    accordionSections: {
      [ACCORDION.INFORMATION]: true,
    },
  };

  onToggleSection = ({ id }) => {
    this.setState(({ accordionSections }) => {
      const isSectionOpened = accordionSections[id];

      return {
        accordionSections: {
          ...accordionSections,
          [id]: !isSectionOpened,
        },
      };
    });
  }

  onExpandAll = (accordionSections) => {
    this.setState({ accordionSections });
  };

  renderLoadingPane = () => {
    const { onClose } = this.props;

    return (
      <Pane
        id="pane-invoiceDetailsLoading"
        defaultWidth="fill"
        dismissible
        onClose={onClose}
      >
        <div>
          <Icon
            icon="spinner-ellipsis"
            width="100px"
          />
        </div>
      </Pane>
    );
  };

  render() {
    const {
      onClose,
      invoice,
    } = this.props;
    const { accordionSections } = this.state;

    if (!invoice) return this.renderLoadingPane();

    const paneTitle = (
      <FormattedMessage
        id="ui-invoice.invoice.details.paneTitle"
        values={{ vendorInvoiceNo: invoice.vendorInvoiceNo }}
      />
    );

    return (
      <Pane
        id="pane-invoiceDetails"
        defaultWidth="fill"
        dismissible
        onClose={onClose}
        paneTitle={paneTitle}
      >
        <Row end="xs">
          <Col xs={12}>
            <ExpandAllButton
              accordionStatus={this.state.accordionSections}
              onToggle={this.onExpandAll}
            />
          </Col>
        </Row>
        <AccordionSet
          accordionStatus={accordionSections}
          onToggle={this.onToggleSection}
        >
          <Accordion
            label={<FormattedMessage id="ui-invoice.invoice.details.information.title" />}
            id={ACCORDION.INFORMATION}
          >
            <Information
              adjustmentsTotal={get(invoice, 'adjustmentsTotal')}
              createdDate={get(invoice, 'metadata.createdDate')}
              updatedDate={get(invoice, 'metadata.updatedDate')}
              invoiceDate={get(invoice, 'invoiceDate')}
              paymentTerms={get(invoice, 'paymentTerms')}
              status={get(invoice, 'status')}
              subTotal={get(invoice, 'subTotal')}
              total={get(invoice, 'total')}
              source={get(invoice, 'source')}
            />
          </Accordion>
        </AccordionSet>
      </Pane>
    );
  }
}

export default InvoiceDetails;
