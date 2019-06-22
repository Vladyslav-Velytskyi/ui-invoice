import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Accordion,
  AccordionSet,
  Col,
  ExpandAllButton,
  Pane,
  Row,
} from '@folio/stripes/components';

import {
  ACCORDION,
} from '../constants';
import ActionMenu from './ActionMenu';
import Information from './Information';
import InvoiceLines, { InvoiceLinesActions } from './InvoiceLines';

class InvoiceDetails extends Component {
  static propTypes = {
    addLines: PropTypes.func.isRequired,
    createLine: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    invoice: PropTypes.object.isRequired,
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

  renderActionMenu = ({ onToggle }) => {
    const { onEdit } = this.props;

    return (
      <ActionMenu
        onEdit={() => {
          onToggle();
          onEdit();
        }}
        onDelete={() => {
          onToggle();
        }}
      />
    );
  }

  renderLinesActions = () => (
    <InvoiceLinesActions
      createLine={this.props.createLine}
      addLines={this.props.addLines}
    />
  );

  render() {
    const {
      onClose,
      invoice,
    } = this.props;
    const { accordionSections } = this.state;

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
        actionMenu={this.renderActionMenu}
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
              metadata={get(invoice, 'metadata')}
            />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-invoice.invoice.details.lines.title" />}
            id={ACCORDION.INFORMATION}
            displayWhenOpen={this.renderLinesActions()}
          >
            <InvoiceLines invoiceId={invoice.id} />
          </Accordion>
        </AccordionSet>
      </Pane>
    );
  }
}

export default InvoiceDetails;
