import React from 'react';

import { useRouter } from 'next/router';

import { EuiSpacer } from '@elastic/eui';
import { WfoUserInputForm } from '@orchestrator-ui/orchestrator-ui-components';
import type { InputForm } from '@orchestrator-ui/orchestrator-ui-components';

export function ExampleFormPage() {
    const router = useRouter();

    const submit = (userInput: { [index: string]: unknown }) => {
        // eslint-disable-next-line no-console
        console.log(userInput);
        alert('See console for submitted form data');
        return Promise.resolve();
    };

    const cancel = () => {
        alert('the form is cancelled');
    };

    const formDefinition = {
        additionalProperties: false,
        $defs: {
            listItem: {
                properties: {
                    listItemText: {
                        type: 'string',
                        title: 'List item text',
                    },
                    listItemNumber: {
                        type: 'number',
                        title: 'List item number',
                    },
                },
                title: 'List item',
                type: 'object',
            },
            additionalProperties: false,
        },
        properties: {
            textField: {
                default: 'default value',
                title: 'Text field',
                type: 'string',
            },
            longText: {
                format: 'long',
                title: 'Long text field',
                type: 'string',
            },
            number: {
                title: 'Number field',
                type: 'number',
            },
            boolean: {
                title: 'Boolean field',
                type: 'boolean',
            },
            label: {
                title: '-- Label followed by a divider --',
                type: 'string',
                format: 'label',
            },
            divider: {
                type: 'string',
                format: 'divider',
            },
            selectField: {
                title: 'Select field',
                enum: ['option1', 'option2', 'option3'],
            },
            radioField: {
                title: 'Radio field',
                enum: ['option1', 'option2', 'option3'],
                checkboxes: true,
            },
            acceptField: {
                title: 'Accept field',
                type: 'string',
                format: 'accept',
            },
            timestampField: {
                default: new Date().getTime(),
                format: 'timestamp',
                title: 'Timestamp field',
                type: 'number',
                uniforms: {
                    dateFormat: 'DD-MMM-YYYY HH:mm z',
                    locale: 'nl-nl',
                    max: null,
                    min: 1715860884,
                    showTimeSelect: true,
                    timeFormat: 'HH:mm',
                },
            },
            listField: {
                default: [],
                items: {
                    $ref: '#/$defs/listItem',
                },
                title: 'List field',
                type: 'array',
                minCount: 1,
            },
            summaryField: {
                type: 'string',
                format: 'summary',
                data: {
                    headers: ['Header 1', 'Header 2'],
                    labels: ['Label 1', 'Label 2'],
                    columns: [
                        ['Column 1 - Row 1', 'Column 1 - Row 2'],
                        ['Column 2 - Row 1', 'Column 2 - Row 2'],
                    ],
                },
            },
            customerField: {
                type: 'string',
                format: 'customerId',
            },
        },
        title: 'Example form',
        type: 'object',
    };

    return (
        <>
            <WfoUserInputForm
                key={'key'}
                router={router}
                stepUserInput={formDefinition as InputForm}
                validSubmit={submit}
                hasNext={false}
                hasPrev={false}
                cancel={cancel}
                previous={cancel}
                userInput={[]}
            />
            <EuiSpacer />
        </>
    );
}

export default ExampleFormPage;
