export const flowData: Record<string, any> = {
    "success": true,
    "fetchedFlow": [
        {
            "_id": "6a312671e5b8680f107773f0",
            "keywords": [],
            "flowMessages": [
                {
                    "messageId": "keyword",
                    "keywords": [],
                    "templates": [],
                    "qrCampaigns": [],
                    "ad": null,
                    "ads": null,
                    "iceBreakers": [],
                    "regexCaseSensitive": false,
                    "triggerMessageId": "1765795011469814",
                    "isOrderEnabled": false
                },
                {
                    "messageId": "1765795011468604",
                    "content": [
                        {
                            "type": "HUMANINTERVENTION",
                            "isRequesting": true
                        }
                    ]
                },
                {
                    "messageId": "keyword",
                    "keywords": [],
                    "templates": [],
                    "qrCampaigns": [],
                    "ad": null,
                    "ads": null,
                    "iceBreakers": [],
                    "regexCaseSensitive": false,
                    "triggerMessageId": "1765795011469814",
                    "isOrderEnabled": false
                },
                {
                    "messageId": "1765795011469814",
                    "content": [
                        {
                            "type": "INTERACTIVE",
                            "interactive": {
                                "type": "button",
                                "body": {
                                    "text": "👋 Welcome to [Your Brand Name]'s Recruitment Assistant! How can we help you today?"
                                },
                                "action": {
                                    "buttons": [
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "message_with_button-1765795011469814-1-|6a312671e5b8680f107773f0",
                                                "title": "View Job Openings"
                                            },
                                            "triggerMessageId": "1765795013194775"
                                        },
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "message_with_button-1765795011469814-2-|6a312671e5b8680f107773f0",
                                                "title": "Check Application Status"
                                            },
                                            "triggerMessageId": "1765795031886718"
                                        },
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "message_with_button-1765795011469814-3-|6a312671e5b8680f107773f0",
                                                "title": "Talk to HR"
                                            },
                                            "triggerMessageId": "1765795011468604"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    "messageId": "1765795013194775",
                    "content": [
                        {
                            "type": "SETUPWEBHOOK",
                            "requestObject": {
                                "url": "https://api.example.com/job-openings",
                                "method": "GET",
                                "params": [],
                                "headers": [],
                                "error": null,
                                "isTestPass": true,
                                "isLoading": false
                            },
                            "attribute": "",
                            "responseKey": "",
                            "statusCodes": [],
                            "triggerMessageId": "1765795024329371",
                            "capturingAttributes": [
                                {
                                    "attribute": "",
                                    "responseKey": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "messageId": "1765795024329371",
                    "content": [
                        {
                            "type": "INTERACTIVE",
                            "interactive": {
                                "type": "list",
                                "header": {
                                    "type": "text",
                                    "text": "Job Opening Filters"
                                },
                                "body": {
                                    "text": "Choose how you want to browse available job openings:"
                                },
                                "footer": {
                                    "text": "More filters are available during application."
                                },
                                "action": {
                                    "button": "Select Filter",
                                    "sections": [
                                        {
                                            "id": "list_message-right-1765795024329371-0",
                                            "title": "Filter Options",
                                            "rows": [
                                                {
                                                    "id": "list_message-right-1765795024329371-0-1765795024329431-|None-|6a312671e5b8680f107773f0",
                                                    "title": "Filter by Department",
                                                    "description": "See jobs by department",
                                                    "triggerMessageId": "1765795026741171"
                                                },
                                                {
                                                    "id": "list_message-right-1765795024329371-0-1765795024329578-|None-|6a312671e5b8680f107773f0",
                                                    "title": "Filter by Location",
                                                    "description": "See jobs in specific locations",
                                                    "triggerMessageId": "1765795026741714"
                                                },
                                                {
                                                    "id": "list_message-right-1765795024329371-0-1765795024329872-|None-|6a312671e5b8680f107773f0",
                                                    "title": "Show All Openings",
                                                    "description": "View the complete job list",
                                                    "triggerMessageId": "1765795028452851"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    "messageId": "1765795026741714",
                    "content": [
                        {
                            "type": "QUESTION",
                            "text": "Which location do you prefer for job openings?",
                            "attribute": "location",
                            "triggerMessageId": "1765795028452851",
                            "attributeNumberOfAttempt": "1",
                            "attributeFormatValue": {
                                "min": "",
                                "max": "",
                                "regex": ""
                            },
                            "attributeFormatValidationErrorMessage": "",
                            "attributeFormat": "Any",
                            "mediaType": "",
                            "delay": "0"
                        }
                    ]
                },
                {
                    "messageId": "1765795026741171",
                    "content": [
                        {
                            "type": "QUESTION",
                            "text": "Which department are you interested in applying for?",
                            "attribute": "department",
                            "triggerMessageId": "1765795028452851",
                            "attributeNumberOfAttempt": "1",
                            "attributeFormatValue": {
                                "min": "",
                                "max": "",
                                "regex": ""
                            },
                            "attributeFormatValidationErrorMessage": "",
                            "attributeFormat": "Any",
                            "mediaType": "",
                            "delay": "0"
                        }
                    ]
                },
                {
                    "messageId": "1765795028452851",
                    "content": [
                        {
                            "type": "SETUPWEBHOOK",
                            "requestObject": {
                                "url": "https://api.example.com/job-listings",
                                "method": "GET",
                                "params": [
                                    {
                                        "name": "department",
                                        "value": "$department"
                                    },
                                    {
                                        "name": "location",
                                        "value": "$location"
                                    }
                                ],
                                "headers": [],
                                "error": null,
                                "isTestPass": true,
                                "isLoading": false
                            },
                            "attribute": "",
                            "responseKey": "",
                            "statusCodes": [],
                            "triggerMessageId": "1765795030362279",
                            "capturingAttributes": [
                                {
                                    "attribute": "",
                                    "responseKey": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "messageId": "1765795030362279",
                    "content": [
                        {
                            "type": "INTERACTIVE",
                            "interactive": {
                                "type": "button",
                                "body": {
                                    "text": "Here are the latest job openings!\n\nEach listing shows the role, location, and experience required. Ready to apply?"
                                },
                                "action": {
                                    "buttons": [
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "message_with_button-1765795030362279-1-|6a312671e5b8680f107773f0",
                                                "title": "Apply Now"
                                            },
                                            "triggerMessageId": "1765795034800782"
                                        },
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "message_with_button-1765795030362279-2-|6a312671e5b8680f107773f0",
                                                "title": "Back to Jobs"
                                            },
                                            "triggerMessageId": "1765795024329371"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    "messageId": "1765795031886718",
                    "content": [
                        {
                            "type": "QUESTION",
                            "text": "Please enter your application reference number or email to check your status.",
                            "attribute": "application_reference",
                            "triggerMessageId": "1765795034800786",
                            "attributeNumberOfAttempt": "3",
                            "attributeFormatValue": {
                                "min": "",
                                "max": "",
                                "regex": ""
                            },
                            "attributeFormatValidationErrorMessage": "",
                            "attributeFormat": "Any",
                            "mediaType": "",
                            "delay": "0"
                        }
                    ]
                },
                {
                    "messageId": "1765795034800786",
                    "content": [
                        {
                            "type": "SETUPWEBHOOK",
                            "requestObject": {
                                "url": "https://api.example.com/application-status",
                                "method": "GET",
                                "params": [
                                    {
                                        "name": "reference",
                                        "value": "$application_reference"
                                    }
                                ],
                                "headers": [],
                                "error": null,
                                "isTestPass": true,
                                "isLoading": false
                            },
                            "attribute": "",
                            "responseKey": "",
                            "statusCodes": [],
                            "triggerMessageId": "1765795045070109",
                            "capturingAttributes": [
                                {
                                    "attribute": "",
                                    "responseKey": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "messageId": "1765795034800782",
                    "content": [
                        {
                            "type": "QUESTION",
                            "text": "What is your full name?",
                            "attribute": "candidate_name",
                            "triggerMessageId": "1765795035989202",
                            "attributeNumberOfAttempt": "1",
                            "attributeFormatValue": {
                                "min": "",
                                "max": "",
                                "regex": ""
                            },
                            "attributeFormatValidationErrorMessage": "",
                            "attributeFormat": "Any",
                            "mediaType": "",
                            "delay": "0"
                        }
                    ]
                },
                {
                    "messageId": "1765795035989202",
                    "content": [
                        {
                            "type": "QUESTION",
                            "text": "What is your phone number?",
                            "attribute": "candidate_phone",
                            "triggerMessageId": "1765795037100941",
                            "attributeNumberOfAttempt": "3",
                            "attributeFormatValue": {
                                "min": "",
                                "max": "",
                                "regex": ""
                            },
                            "attributeFormatValidationErrorMessage": "",
                            "attributeFormat": "Any",
                            "mediaType": "",
                            "delay": "0"
                        }
                    ]
                },
                {
                    "messageId": "1765795037100941",
                    "content": [
                        {
                            "type": "QUESTION",
                            "text": "What is your email address?",
                            "attribute": "candidate_email",
                            "triggerMessageId": "1765795038371686",
                            "attributeNumberOfAttempt": "3",
                            "attributeFormatValue": {
                                "min": "",
                                "max": "",
                                "regex": ""
                            },
                            "attributeFormatValidationErrorMessage": "",
                            "attributeFormat": "Any",
                            "mediaType": "",
                            "delay": "0"
                        }
                    ]
                },
                {
                    "messageId": "1765795038371686",
                    "content": [
                        {
                            "type": "QUESTION",
                            "text": "How many years of total experience do you have?",
                            "attribute": "candidate_experience",
                            "triggerMessageId": "1765795039871184",
                            "attributeNumberOfAttempt": "1",
                            "attributeFormatValue": {
                                "min": "",
                                "max": "",
                                "regex": ""
                            },
                            "attributeFormatValidationErrorMessage": "",
                            "attributeFormat": "Any",
                            "mediaType": "",
                            "delay": "0"
                        }
                    ]
                },
                {
                    "messageId": "1765795039871184",
                    "content": [
                        {
                            "type": "QUESTION",
                            "text": "List your key skills (separated by commas).",
                            "attribute": "candidate_skills",
                            "triggerMessageId": "1765795040829707",
                            "attributeNumberOfAttempt": "1",
                            "attributeFormatValue": {
                                "min": "",
                                "max": "",
                                "regex": ""
                            },
                            "attributeFormatValidationErrorMessage": "",
                            "attributeFormat": "Any",
                            "mediaType": "",
                            "delay": "0"
                        }
                    ]
                },
                {
                    "messageId": "1765795040829707",
                    "content": [
                        {
                            "type": "QUESTION",
                            "text": "Please upload your resume.",
                            "attribute": "candidate_resume",
                            "triggerMessageId": "1765795041882391",
                            "attributeNumberOfAttempt": "1",
                            "attributeFormatValue": {
                                "min": "",
                                "max": "",
                                "regex": ""
                            },
                            "attributeFormatValidationErrorMessage": "",
                            "attributeFormat": "Any",
                            "mediaType": "",
                            "delay": "0"
                        }
                    ]
                },
                {
                    "messageId": "1765795041882391",
                    "content": [
                        {
                            "type": "SETUPWEBHOOK",
                            "requestObject": {
                                "url": "https://api.example.com/job-applications",
                                "method": "POST",
                                "params": [],
                                "headers": [],
                                "error": null,
                                "isTestPass": true,
                                "isLoading": false
                            },
                            "attribute": "",
                            "responseKey": "",
                            "statusCodes": [],
                            "triggerMessageId": "1765795043467985",
                            "capturingAttributes": [
                                {
                                    "attribute": "",
                                    "responseKey": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "messageId": "1765795043467985",
                    "content": [
                        {
                            "type": "INTERACTIVE",
                            "interactive": {
                                "type": "button",
                                "body": {
                                    "text": "Thank you for your application! 🎉\n\nYour application has been submitted. Would you like to schedule an interview or return to the main menu?"
                                },
                                "action": {
                                    "buttons": [
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "message_with_button-1765795043467985-1-|6a312671e5b8680f107773f0",
                                                "title": "Schedule Interview"
                                            },
                                            "triggerMessageId": "1765795051692731"
                                        },
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "message_with_button-1765795043467985-2-|6a312671e5b8680f107773f0",
                                                "title": "Back to Start"
                                            },
                                            "triggerMessageId": "1765795011469814"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    "messageId": "1765795045070109",
                    "content": [
                        {
                            "type": "INTERACTIVE",
                            "interactive": {
                                "type": "button",
                                "body": {
                                    "text": "Here is your application status: \n\n(Details loaded from our system)\n\nIf you need more help, please choose an option below."
                                },
                                "action": {
                                    "buttons": [
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "message_with_button-1765795045070109-1-|6a312671e5b8680f107773f0",
                                                "title": "Back to Start"
                                            },
                                            "triggerMessageId": "1765795011469814"
                                        },
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "message_with_button-1765795045070109-2-|6a312671e5b8680f107773f0",
                                                "title": "Talk to HR"
                                            },
                                            "triggerMessageId": "1765795011468604"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    "messageId": "1765795051692731",
                    "content": [
                        {
                            "type": "SETUPWEBHOOK",
                            "requestObject": {
                                "url": "https://api.example.com/hr-availability",
                                "method": "GET",
                                "params": [],
                                "headers": [],
                                "error": null,
                                "isTestPass": true,
                                "isLoading": false
                            },
                            "attribute": "",
                            "responseKey": "",
                            "statusCodes": [],
                            "triggerMessageId": "1765795053378582",
                            "capturingAttributes": [
                                {
                                    "attribute": "",
                                    "responseKey": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "messageId": "1765795053378582",
                    "content": [
                        {
                            "type": "INTERACTIVE",
                            "interactive": {
                                "type": "button",
                                "body": {
                                    "text": "Here are available interview slots. Please select a suitable option or return to the start."
                                },
                                "action": {
                                    "buttons": [
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "message_with_button-1765795053378582-1-|6a312671e5b8680f107773f0",
                                                "title": "Pick This Slot"
                                            },
                                            "triggerMessageId": "1765795054986889"
                                        },
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "message_with_button-1765795053378582-2-|6a312671e5b8680f107773f0",
                                                "title": "Back to Start"
                                            },
                                            "triggerMessageId": "1765795011469814"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    "messageId": "1765795054986889",
                    "content": [
                        {
                            "type": "SETUPWEBHOOK",
                            "requestObject": {
                                "url": "https://api.example.com/book-interview",
                                "method": "POST",
                                "params": [],
                                "headers": [],
                                "error": null,
                                "isTestPass": true,
                                "isLoading": false
                            },
                            "attribute": "",
                            "responseKey": "",
                            "statusCodes": [],
                            "triggerMessageId": "1765795056687619",
                            "capturingAttributes": [
                                {
                                    "attribute": "",
                                    "responseKey": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "messageId": "1765795056687619",
                    "content": [
                        {
                            "type": "INTERACTIVE",
                            "interactive": {
                                "type": "button",
                                "body": {
                                    "text": "Your interview has been scheduled successfully! Check your email for details.\n\nWhat would you like to do next?"
                                },
                                "action": {
                                    "buttons": [
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "message_with_button-1765795056687619-1-|6a312671e5b8680f107773f0",
                                                "title": "Back to Start"
                                            },
                                            "triggerMessageId": "1765795011469814"
                                        },
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "message_with_button-1765795056687619-2-|6a312671e5b8680f107773f0",
                                                "title": "Talk to HR"
                                            },
                                            "triggerMessageId": "1765795011468604"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    "messageId": "1781693111066",
                    "content": [
                        {
                            "type": "QUESTION",
                            "text": "testing question",
                            "attribute": "Salary",
                            "attributeNumberOfAttempt": "1",
                            "attributeFormatValue": {
                                "min": "",
                                "max": "",
                                "regex": ""
                            },
                            "attributeFormatValidationErrorMessage": "",
                            "attributeFormat": "Any",
                            "mediaType": ""
                        }
                    ]
                }
            ],
            "status": false,
            "isDeleted": false,
            "type": "USER",
            "hasAiKeyword": false,
            "assistantId": "6a3115d2e5b8680f107218f3",
            "clientId": "6a3115d2e5b8680f107218ee",
            "flowName": "Recruitment/Job Bot API",
            "flow": {
                "nodes": [
                    {
                        "id": "keyword",
                        "type": "keywordBox",
                        "data": {
                            "label": "Node 1",
                            "text": "Add keywords to start chat ",
                            "keywords": [],
                            "templates": [],
                            "qrCampaigns": [],
                            "ad": null,
                            "regexCaseSensitive": false,
                            "isNewFlow": true
                        },
                        "position": {
                            "x": -2892.904214857931,
                            "y": 505.1632261084028
                        },
                        "positionAbsolute": {
                            "x": -2081,
                            "y": 476
                        }
                    },
                    {
                        "id": "1765795011468604",
                        "type": "masterComponent",
                        "node_index": 18,
                        "data": {
                            "isDrag": true,
                            "id": "1765795011468604",
                            "content": [
                                {
                                    "id": "1765795011468604-humanIntervention",
                                    "type": "humanIntervention",
                                    "data": {
                                        "isRequesting": true
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": 531.4746330948062,
                            "y": 1192.7884340180424
                        }
                    },
                    {
                        "id": "keyword",
                        "type": "keywordBox",
                        "data": {
                            "label": "Node 1",
                            "text": "Add keywords to start chat ",
                            "keywords": [],
                            "templates": [],
                            "qrCampaigns": [],
                            "ad": null,
                            "regexCaseSensitive": false,
                            "isNewFlow": true
                        },
                        "position": {
                            "x": -2081,
                            "y": 476
                        },
                        "positionAbsolute": {
                            "x": -2081,
                            "y": 476
                        }
                    },
                    {
                        "id": "1765795011469814",
                        "type": "masterComponent",
                        "node_index": 1,
                        "data": {
                            "isDrag": true,
                            "id": "1765795011469814",
                            "content": [
                                {
                                    "id": "1765795011469814-message",
                                    "type": "message",
                                    "data": {
                                        "text": "👋 Welcome to [Your Brand Name]'s Recruitment Assistant! How can we help you today?",
                                        "buttons": [
                                            {
                                                "text": "View Job Openings",
                                                "id": 1,
                                                "source_handle_type": "message_with_button"
                                            },
                                            {
                                                "text": "Check Application Status",
                                                "id": 2,
                                                "source_handle_type": "message_with_button"
                                            },
                                            {
                                                "text": "Talk to HR",
                                                "id": 3,
                                                "source_handle_type": "message_with_button"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": -2626.6218262393527,
                            "y": 497.14037823928595
                        }
                    },
                    {
                        "id": "1765795013194775",
                        "type": "masterComponent",
                        "node_index": 2,
                        "data": {
                            "isDrag": true,
                            "id": "1765795013194775",
                            "content": [
                                {
                                    "id": "1765795013194775-setupWebhook",
                                    "type": "setupWebhook",
                                    "data": {
                                        "requestObject": {
                                            "url": "https://api.example.com/job-openings",
                                            "method": "GET",
                                            "params": [],
                                            "headers": [],
                                            "error": null,
                                            "isTestPass": true,
                                            "isLoading": false
                                        },
                                        "attribute": "",
                                        "responseKey": "",
                                        "statusCodes": [],
                                        "capturingAttributes": [
                                            {
                                                "attribute": "",
                                                "responseKey": ""
                                            }
                                        ]
                                    },
                                    "source_handle_type": "setup-webhoook"
                                }
                            ]
                        },
                        "position": {
                            "x": -1485.8316757875555,
                            "y": 463.6460479042695
                        }
                    },
                    {
                        "id": "1765795024329371",
                        "type": "masterComponent",
                        "node_index": 3,
                        "data": {
                            "isDrag": true,
                            "id": "1765795024329371",
                            "content": [
                                {
                                    "id": "1765795024329371-listMessage",
                                    "type": "listMessage",
                                    "data": {
                                        "header": "Job Opening Filters",
                                        "body": "Choose how you want to browse available job openings:",
                                        "footer": "More filters are available during application.",
                                        "itemsCount": 3,
                                        "sectionsCount": 1,
                                        "sections": [
                                            {
                                                "title": "Filter Options",
                                                "items": [
                                                    {
                                                        "title": "Filter by Department",
                                                        "description": "See jobs by department",
                                                        "id": "list_message-right-1765795024329371-0-1765795024329431-|None",
                                                        "source_handle_type": "list_message-right-1765795024329371-0-1765795024329431-|None"
                                                    },
                                                    {
                                                        "title": "Filter by Location",
                                                        "description": "See jobs in specific locations",
                                                        "id": "list_message-right-1765795024329371-0-1765795024329578-|None",
                                                        "source_handle_type": "list_message-right-1765795024329371-0-1765795024329578-|None"
                                                    },
                                                    {
                                                        "title": "Show All Openings",
                                                        "description": "View the complete job list",
                                                        "id": "list_message-right-1765795024329371-0-1765795024329872-|None",
                                                        "source_handle_type": "list_message-right-1765795024329371-0-1765795024329872-|None"
                                                    }
                                                ],
                                                "id": "list_message-right-1765795024329371-0"
                                            }
                                        ],
                                        "buttonTitle": "Select Filter"
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": -1183.5261317919253,
                            "y": 19.20549151857756
                        }
                    },
                    {
                        "id": "1765795026741714",
                        "type": "masterComponent",
                        "node_index": 5,
                        "data": {
                            "isDrag": true,
                            "id": "1765795026741714",
                            "content": [
                                {
                                    "id": "1765795026741714-questionMessage",
                                    "type": "questionMessage",
                                    "data": {
                                        "text": "Which location do you prefer for job openings?",
                                        "attribute": "location",
                                        "attributeNumberOfAttempt": "1",
                                        "attributeFormatValue": {
                                            "min": "",
                                            "max": "",
                                            "regex": ""
                                        },
                                        "attributeFormatValidationErrorMessage": "",
                                        "attributeFormat": "Any",
                                        "mediaType": "",
                                        "delay": "0",
                                        "source_handle_type": "question"
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": 209.56921041380656,
                            "y": 405.73620508305737
                        }
                    },
                    {
                        "id": "1765795026741171",
                        "type": "masterComponent",
                        "node_index": 4,
                        "data": {
                            "isDrag": true,
                            "id": "1765795026741171",
                            "content": [
                                {
                                    "id": "1765795026741171-questionMessage",
                                    "type": "questionMessage",
                                    "data": {
                                        "text": "Which department are you interested in applying for?",
                                        "attribute": "department",
                                        "attributeNumberOfAttempt": "1",
                                        "attributeFormatValue": {
                                            "min": "",
                                            "max": "",
                                            "regex": ""
                                        },
                                        "attributeFormatValidationErrorMessage": "",
                                        "attributeFormat": "Any",
                                        "mediaType": "",
                                        "delay": "0",
                                        "source_handle_type": "question"
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": 104.04023711401874,
                            "y": -309.05739470732743
                        }
                    },
                    {
                        "id": "1765795028452851",
                        "type": "masterComponent",
                        "node_index": 6,
                        "data": {
                            "isDrag": true,
                            "id": "1765795028452851",
                            "content": [
                                {
                                    "id": "1765795028452851-setupWebhook",
                                    "type": "setupWebhook",
                                    "data": {
                                        "requestObject": {
                                            "url": "https://api.example.com/job-listings",
                                            "method": "GET",
                                            "params": [
                                                {
                                                    "name": "department",
                                                    "value": "$department"
                                                },
                                                {
                                                    "name": "location",
                                                    "value": "$location"
                                                }
                                            ],
                                            "headers": [],
                                            "error": null,
                                            "isTestPass": true,
                                            "isLoading": false
                                        },
                                        "attribute": "",
                                        "responseKey": "",
                                        "statusCodes": [],
                                        "capturingAttributes": [
                                            {
                                                "attribute": "",
                                                "responseKey": ""
                                            }
                                        ]
                                    },
                                    "source_handle_type": "setup-webhoook"
                                }
                            ]
                        },
                        "position": {
                            "x": 560.6379160283718,
                            "y": -24.76498921871932
                        }
                    },
                    {
                        "id": "1765795030362279",
                        "type": "masterComponent",
                        "node_index": 7,
                        "data": {
                            "isDrag": true,
                            "id": "1765795030362279",
                            "content": [
                                {
                                    "id": "1765795030362279-message",
                                    "type": "message",
                                    "data": {
                                        "text": "Here are the latest job openings!\n\nEach listing shows the role, location, and experience required. Ready to apply?",
                                        "buttons": [
                                            {
                                                "text": "Apply Now",
                                                "id": 1,
                                                "source_handle_type": "message_with_button"
                                            },
                                            {
                                                "text": "Back to Jobs",
                                                "id": 2,
                                                "source_handle_type": "message_with_button"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": 884.1784298305149,
                            "y": -10.991397861753569
                        }
                    },
                    {
                        "id": "1765795031886718",
                        "type": "masterComponent",
                        "node_index": 8,
                        "data": {
                            "isDrag": true,
                            "id": "1765795031886718",
                            "content": [
                                {
                                    "id": "1765795031886718-questionMessage",
                                    "type": "questionMessage",
                                    "data": {
                                        "text": "Please enter your application reference number or email to check your status.",
                                        "attribute": "application_reference",
                                        "attributeNumberOfAttempt": "3",
                                        "attributeFormatValue": {
                                            "min": "",
                                            "max": "",
                                            "regex": ""
                                        },
                                        "attributeFormatValidationErrorMessage": "",
                                        "attributeFormat": "Any",
                                        "mediaType": "",
                                        "delay": "0",
                                        "source_handle_type": "question"
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": -690.9675605608263,
                            "y": 1478.3468499109572
                        }
                    },
                    {
                        "id": "1765795034800786",
                        "type": "masterComponent",
                        "node_index": 10,
                        "data": {
                            "isDrag": true,
                            "id": "1765795034800786",
                            "content": [
                                {
                                    "id": "1765795034800786-setupWebhook",
                                    "type": "setupWebhook",
                                    "data": {
                                        "requestObject": {
                                            "url": "https://api.example.com/application-status",
                                            "method": "GET",
                                            "params": [
                                                {
                                                    "name": "reference",
                                                    "value": "$application_reference"
                                                }
                                            ],
                                            "headers": [],
                                            "error": null,
                                            "isTestPass": true,
                                            "isLoading": false
                                        },
                                        "attribute": "",
                                        "responseKey": "",
                                        "statusCodes": [],
                                        "capturingAttributes": [
                                            {
                                                "attribute": "",
                                                "responseKey": ""
                                            }
                                        ]
                                    },
                                    "source_handle_type": "setup-webhoook"
                                }
                            ]
                        },
                        "position": {
                            "x": -372.7731593186113,
                            "y": 1488.0798329509662
                        }
                    },
                    {
                        "id": "1765795034800782",
                        "type": "masterComponent",
                        "node_index": 9,
                        "data": {
                            "isDrag": true,
                            "id": "1765795034800782",
                            "content": [
                                {
                                    "id": "1765795034800782-questionMessage",
                                    "type": "questionMessage",
                                    "data": {
                                        "text": "What is your full name?",
                                        "attribute": "candidate_name",
                                        "attributeNumberOfAttempt": "1",
                                        "attributeFormatValue": {
                                            "min": "",
                                            "max": "",
                                            "regex": ""
                                        },
                                        "attributeFormatValidationErrorMessage": "",
                                        "attributeFormat": "Any",
                                        "mediaType": "",
                                        "delay": "0",
                                        "source_handle_type": "question"
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": 1318.3228266231206,
                            "y": 213.86492567640488
                        }
                    },
                    {
                        "id": "1765795035989202",
                        "type": "masterComponent",
                        "node_index": 11,
                        "data": {
                            "isDrag": true,
                            "id": "1765795035989202",
                            "content": [
                                {
                                    "id": "1765795035989202-questionMessage",
                                    "type": "questionMessage",
                                    "data": {
                                        "text": "What is your phone number?",
                                        "attribute": "candidate_phone",
                                        "attributeNumberOfAttempt": "3",
                                        "attributeFormatValue": {
                                            "min": "",
                                            "max": "",
                                            "regex": ""
                                        },
                                        "attributeFormatValidationErrorMessage": "",
                                        "attributeFormat": "Any",
                                        "mediaType": "",
                                        "delay": "0",
                                        "source_handle_type": "question"
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": 1626.3302994043472,
                            "y": 221.89524593180255
                        }
                    },
                    {
                        "id": "1765795037100941",
                        "type": "masterComponent",
                        "node_index": 12,
                        "data": {
                            "isDrag": true,
                            "id": "1765795037100941",
                            "content": [
                                {
                                    "id": "1765795037100941-questionMessage",
                                    "type": "questionMessage",
                                    "data": {
                                        "text": "What is your email address?",
                                        "attribute": "candidate_email",
                                        "attributeNumberOfAttempt": "3",
                                        "attributeFormatValue": {
                                            "min": "",
                                            "max": "",
                                            "regex": ""
                                        },
                                        "attributeFormatValidationErrorMessage": "",
                                        "attributeFormat": "Any",
                                        "mediaType": "",
                                        "delay": "0",
                                        "source_handle_type": "question"
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": 1950.8163176885168,
                            "y": 234.98186321744413
                        }
                    },
                    {
                        "id": "1765795038371686",
                        "type": "masterComponent",
                        "node_index": 13,
                        "data": {
                            "isDrag": true,
                            "id": "1765795038371686",
                            "content": [
                                {
                                    "id": "1765795038371686-questionMessage",
                                    "type": "questionMessage",
                                    "data": {
                                        "text": "How many years of total experience do you have?",
                                        "attribute": "candidate_experience",
                                        "attributeNumberOfAttempt": "1",
                                        "attributeFormatValue": {
                                            "min": "",
                                            "max": "",
                                            "regex": ""
                                        },
                                        "attributeFormatValidationErrorMessage": "",
                                        "attributeFormat": "Any",
                                        "mediaType": "",
                                        "delay": "0",
                                        "source_handle_type": "question"
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": 2280.9629549395804,
                            "y": 238.98186321744413
                        }
                    },
                    {
                        "id": "1765795039871184",
                        "type": "masterComponent",
                        "node_index": 14,
                        "data": {
                            "isDrag": true,
                            "id": "1765795039871184",
                            "content": [
                                {
                                    "id": "1765795039871184-questionMessage",
                                    "type": "questionMessage",
                                    "data": {
                                        "text": "List your key skills (separated by commas).",
                                        "attribute": "candidate_skills",
                                        "attributeNumberOfAttempt": "1",
                                        "attributeFormatValue": {
                                            "min": "",
                                            "max": "",
                                            "regex": ""
                                        },
                                        "attributeFormatValidationErrorMessage": "",
                                        "attributeFormat": "Any",
                                        "mediaType": "",
                                        "delay": "0",
                                        "source_handle_type": "question"
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": 2590.2884786282316,
                            "y": 256.9818632174439
                        }
                    },
                    {
                        "id": "1765795040829707",
                        "type": "masterComponent",
                        "node_index": 15,
                        "data": {
                            "isDrag": true,
                            "id": "1765795040829707",
                            "content": [
                                {
                                    "id": "1765795040829707-questionMessage",
                                    "type": "questionMessage",
                                    "data": {
                                        "text": "Please upload your resume.",
                                        "attribute": "candidate_resume",
                                        "attributeNumberOfAttempt": "1",
                                        "attributeFormatValue": {
                                            "min": "",
                                            "max": "",
                                            "regex": ""
                                        },
                                        "attributeFormatValidationErrorMessage": "",
                                        "attributeFormat": "Any",
                                        "mediaType": "",
                                        "delay": "0",
                                        "source_handle_type": "question"
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": 2922.242595667215,
                            "y": 274.04325153962975
                        }
                    },
                    {
                        "id": "1765795041882391",
                        "type": "masterComponent",
                        "node_index": 16,
                        "data": {
                            "isDrag": true,
                            "id": "1765795041882391",
                            "content": [
                                {
                                    "id": "1765795041882391-setupWebhook",
                                    "type": "setupWebhook",
                                    "data": {
                                        "requestObject": {
                                            "url": "https://api.example.com/job-applications",
                                            "method": "POST",
                                            "params": [],
                                            "headers": [],
                                            "error": null,
                                            "isTestPass": true,
                                            "isLoading": false
                                        },
                                        "attribute": "",
                                        "responseKey": "",
                                        "statusCodes": [],
                                        "capturingAttributes": [
                                            {
                                                "attribute": "",
                                                "responseKey": ""
                                            }
                                        ]
                                    },
                                    "source_handle_type": "setup-webhoook"
                                }
                            ]
                        },
                        "position": {
                            "x": 3237.032851358037,
                            "y": 290.831639861957
                        }
                    },
                    {
                        "id": "1765795043467985",
                        "type": "masterComponent",
                        "node_index": 17,
                        "data": {
                            "isDrag": true,
                            "id": "1765795043467985",
                            "content": [
                                {
                                    "id": "1765795043467985-message",
                                    "type": "message",
                                    "data": {
                                        "text": "Thank you for your application! 🎉\n\nYour application has been submitted. Would you like to schedule an interview or return to the main menu?",
                                        "buttons": [
                                            {
                                                "text": "Schedule Interview",
                                                "id": 1,
                                                "source_handle_type": "message_with_button"
                                            },
                                            {
                                                "text": "Back to Start",
                                                "id": 2,
                                                "source_handle_type": "message_with_button"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": 3985.3551342384735,
                            "y": 498.67902510107626
                        }
                    },
                    {
                        "id": "1765795045070109",
                        "type": "masterComponent",
                        "node_index": 19,
                        "data": {
                            "isDrag": true,
                            "id": "1765795045070109",
                            "content": [
                                {
                                    "id": "1765795045070109-message",
                                    "type": "message",
                                    "data": {
                                        "text": "Here is your application status: \n\n(Details loaded from our system)\n\nIf you need more help, please choose an option below.",
                                        "buttons": [
                                            {
                                                "text": "Back to Start",
                                                "id": 1,
                                                "source_handle_type": "message_with_button"
                                            },
                                            {
                                                "text": "Talk to HR",
                                                "id": 2,
                                                "source_handle_type": "message_with_button"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": -60.018747547158455,
                            "y": 1243.780413338432
                        }
                    },
                    {
                        "id": "1765795051692731",
                        "type": "masterComponent",
                        "node_index": 20,
                        "data": {
                            "isDrag": true,
                            "id": "1765795051692731",
                            "content": [
                                {
                                    "id": "1765795051692731-setupWebhook",
                                    "type": "setupWebhook",
                                    "data": {
                                        "requestObject": {
                                            "url": "https://api.example.com/hr-availability",
                                            "method": "GET",
                                            "params": [],
                                            "headers": [],
                                            "error": null,
                                            "isTestPass": true,
                                            "isLoading": false
                                        },
                                        "attribute": "",
                                        "responseKey": "",
                                        "statusCodes": [],
                                        "capturingAttributes": [
                                            {
                                                "attribute": "",
                                                "responseKey": ""
                                            }
                                        ]
                                    },
                                    "source_handle_type": "setup-webhoook"
                                }
                            ]
                        },
                        "position": {
                            "x": 4454.465343750864,
                            "y": 634.7645797623336
                        }
                    },
                    {
                        "id": "1765795053378582",
                        "type": "masterComponent",
                        "node_index": 21,
                        "data": {
                            "isDrag": true,
                            "id": "1765795053378582",
                            "content": [
                                {
                                    "id": "1765795053378582-message",
                                    "type": "message",
                                    "data": {
                                        "text": "Here are available interview slots. Please select a suitable option or return to the start.",
                                        "buttons": [
                                            {
                                                "text": "Pick This Slot",
                                                "id": 1,
                                                "source_handle_type": "message_with_button"
                                            },
                                            {
                                                "text": "Back to Start",
                                                "id": 2,
                                                "source_handle_type": "message_with_button"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": 4802.66879440882,
                            "y": 1066.6223367605419
                        }
                    },
                    {
                        "id": "1765795054986889",
                        "type": "masterComponent",
                        "node_index": 22,
                        "data": {
                            "isDrag": true,
                            "id": "1765795054986889",
                            "content": [
                                {
                                    "id": "1765795054986889-setupWebhook",
                                    "type": "setupWebhook",
                                    "data": {
                                        "requestObject": {
                                            "url": "https://api.example.com/book-interview",
                                            "method": "POST",
                                            "params": [],
                                            "headers": [],
                                            "error": null,
                                            "isTestPass": true,
                                            "isLoading": false
                                        },
                                        "attribute": "",
                                        "responseKey": "",
                                        "statusCodes": [],
                                        "capturingAttributes": [
                                            {
                                                "attribute": "",
                                                "responseKey": ""
                                            }
                                        ]
                                    },
                                    "source_handle_type": "setup-webhoook"
                                }
                            ]
                        },
                        "position": {
                            "x": 5121.762556597699,
                            "y": 1071.7731331360171
                        }
                    },
                    {
                        "id": "1765795056687619",
                        "type": "masterComponent",
                        "node_index": 23,
                        "data": {
                            "isDrag": true,
                            "id": "1765795056687619",
                            "content": [
                                {
                                    "id": "1765795056687619-message",
                                    "type": "message",
                                    "data": {
                                        "text": "Your interview has been scheduled successfully! Check your email for details.\n\nWhat would you like to do next?",
                                        "buttons": [
                                            {
                                                "text": "Back to Start",
                                                "id": 1,
                                                "source_handle_type": "message_with_button"
                                            },
                                            {
                                                "text": "Talk to HR",
                                                "id": 2,
                                                "source_handle_type": "message_with_button"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": 5480.342482700184,
                            "y": 1518.1236211062203
                        }
                    },
                    {
                        "id": "1781693111066",
                        "type": "masterComponent",
                        "data": {
                            "isDrag": true,
                            "id": "1781693111066",
                            "content": [
                                {
                                    "id": "1781693111066-questionMessage",
                                    "type": "questionMessage",
                                    "data": {
                                        "text": "testing question",
                                        "attribute": "Salary",
                                        "attributeNumberOfAttempt": "1",
                                        "attributeFormatValue": {
                                            "min": "",
                                            "max": "",
                                            "regex": ""
                                        },
                                        "attributeFormatValidationErrorMessage": "",
                                        "attributeFormat": "Any",
                                        "mediaType": ""
                                    }
                                }
                            ]
                        },
                        "position": {
                            "x": -204.8736733846245,
                            "y": 1954.7484489535602
                        }
                    }
                ],
                "edges": [
                    {
                        "source": "keyword",
                        "sourceHandle": "keyword-right-keyword",
                        "target": "1765795011469814",
                        "targetHandle": "master-component-left-1765795011469814",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795011469814",
                        "sourceHandle": "message_with_button-right-1765795011469814-2",
                        "target": "1765795031886718",
                        "targetHandle": "master-component-left-1765795031886718",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795011469814",
                        "sourceHandle": "message_with_button-right-1765795011469814-1",
                        "target": "1765795013194775",
                        "targetHandle": "master-component-left-1765795013194775",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795011469814",
                        "sourceHandle": "message_with_button-right-1765795011469814-3",
                        "target": "1765795011468604",
                        "targetHandle": "master-component-left-1765795011468604",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795013194775",
                        "sourceHandle": "setup-webhoook-right-1765795013194775",
                        "target": "1765795024329371",
                        "targetHandle": "master-component-left-1765795024329371",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795024329371",
                        "sourceHandle": "list_message-right-1765795024329371-0-1765795024329872-|None",
                        "target": "1765795028452851",
                        "targetHandle": "master-component-left-1765795028452851",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795024329371",
                        "sourceHandle": "list_message-right-1765795024329371-0-1765795024329578-|None",
                        "target": "1765795026741714",
                        "targetHandle": "master-component-left-1765795026741714",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795024329371",
                        "sourceHandle": "list_message-right-1765795024329371-0-1765795024329431-|None",
                        "target": "1765795026741171",
                        "targetHandle": "master-component-left-1765795026741171",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795026741714",
                        "sourceHandle": "question-right-1765795026741714",
                        "target": "1765795028452851",
                        "targetHandle": "master-component-left-1765795028452851",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795026741171",
                        "sourceHandle": "question-right-1765795026741171",
                        "target": "1765795028452851",
                        "targetHandle": "master-component-left-1765795028452851",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795028452851",
                        "sourceHandle": "setup-webhoook-right-1765795028452851",
                        "target": "1765795030362279",
                        "targetHandle": "master-component-left-1765795030362279",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795030362279",
                        "sourceHandle": "message_with_button-right-1765795030362279-2",
                        "target": "1765795024329371",
                        "targetHandle": "master-component-left-1765795024329371",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795030362279",
                        "sourceHandle": "message_with_button-right-1765795030362279-1",
                        "target": "1765795034800782",
                        "targetHandle": "master-component-left-1765795034800782",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795034800786",
                        "sourceHandle": "setup-webhoook-right-1765795034800786",
                        "target": "1765795045070109",
                        "targetHandle": "master-component-left-1765795045070109",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795034800782",
                        "sourceHandle": "question-right-1765795034800782",
                        "target": "1765795035989202",
                        "targetHandle": "master-component-left-1765795035989202",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795031886718",
                        "sourceHandle": "question-right-1765795031886718",
                        "target": "1765795034800786",
                        "targetHandle": "master-component-left-1765795034800786",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795035989202",
                        "sourceHandle": "question-right-1765795035989202",
                        "target": "1765795037100941",
                        "targetHandle": "master-component-left-1765795037100941",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795037100941",
                        "sourceHandle": "question-right-1765795037100941",
                        "target": "1765795038371686",
                        "targetHandle": "master-component-left-1765795038371686",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795039871184",
                        "sourceHandle": "question-right-1765795039871184",
                        "target": "1765795040829707",
                        "targetHandle": "master-component-left-1765795040829707",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795040829707",
                        "sourceHandle": "question-right-1765795040829707",
                        "target": "1765795041882391",
                        "targetHandle": "master-component-left-1765795041882391",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795038371686",
                        "sourceHandle": "question-right-1765795038371686",
                        "target": "1765795039871184",
                        "targetHandle": "master-component-left-1765795039871184",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795041882391",
                        "sourceHandle": "setup-webhoook-right-1765795041882391",
                        "target": "1765795043467985",
                        "targetHandle": "master-component-left-1765795043467985",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795043467985",
                        "sourceHandle": "message_with_button-right-1765795043467985-1",
                        "target": "1765795051692731",
                        "targetHandle": "master-component-left-1765795051692731",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795043467985",
                        "sourceHandle": "message_with_button-right-1765795043467985-2",
                        "target": "1765795011469814",
                        "targetHandle": "master-component-left-1765795011469814",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795051692731",
                        "sourceHandle": "setup-webhoook-right-1765795051692731",
                        "target": "1765795053378582",
                        "targetHandle": "master-component-left-1765795053378582",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795053378582",
                        "sourceHandle": "message_with_button-right-1765795053378582-2",
                        "target": "1765795011469814",
                        "targetHandle": "master-component-left-1765795011469814",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795053378582",
                        "sourceHandle": "message_with_button-right-1765795053378582-1",
                        "target": "1765795054986889",
                        "targetHandle": "master-component-left-1765795054986889",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795054986889",
                        "sourceHandle": "setup-webhoook-right-1765795054986889",
                        "target": "1765795056687619",
                        "targetHandle": "master-component-left-1765795056687619",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795056687619",
                        "sourceHandle": "message_with_button-right-1765795056687619-2",
                        "target": "1765795011468604",
                        "targetHandle": "master-component-left-1765795011468604",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795056687619",
                        "sourceHandle": "message_with_button-right-1765795056687619-1",
                        "target": "1765795011469814",
                        "targetHandle": "master-component-left-1765795011469814",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795045070109",
                        "sourceHandle": "message_with_button-right-1765795045070109-1",
                        "target": "1765795011469814",
                        "targetHandle": "master-component-left-1765795011469814",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    },
                    {
                        "source": "1765795045070109",
                        "sourceHandle": "message_with_button-right-1765795045070109-2",
                        "target": "1765795011468604",
                        "targetHandle": "master-component-left-1765795011468604",
                        "type": "buttonedge",
                        "markerEnd": {
                            "type": "arrowclosed",
                            "width": 20,
                            "height": 20,
                            "color": "#008069"
                        },
                        "animated": true,
                        "style": {
                            "strokeWidth": 1,
                            "stroke": "#008069"
                        }
                    }
                ]
            },
            "catalogueId": null,
            "createdBy": "6a3115d2e5b8680f107218ee",
            "createdAt": "2026-06-16T10:33:21.318Z",
            "updatedAt": "2026-06-17T11:03:05.901Z",
            "__v": 0,
            "intents": {}
        }
    ]
}