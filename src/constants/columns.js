const COLUMN_TYPE = {
    SINGLE: 'Single Column',
    MULTI: 'Multiple Columns',
    OTHER: 'Has Other Column',
    MERGE: 'Merge Other Column',
}

const COLUMNS_ENUM = {
    ID: 'ID',
    COURSE_ADVERTISED: 'Where did you see the course advertised?',
    CAREER_STAGE: 'What is your career stage?',
    EMPLOYMENT_SECTOR: 'What is your employment sector?',
    EMPLOYMENT_COUNTRY: 'What is your country of employment?',
    GENDER: 'What is your gender?',
    HAVE_YOU_USED_TOOLS_COVERED:
        'Have you used the tool(s)/resource(s) covered in the course before?',
    WILL_YOU_USE_TOOLS_COVERED:
        'Will you use the tool(s)/resource(s) covered in the course again?',
    RECOMMEND_COURSE: 'Would you recommend the course?',
    OVERALL_RATING_ENTIRE_COURSE:
        'Please tell us your overall rating for the entire course',
    MAY_CONTACT_EMAIL_FEEDBACK:
        'May we contact you by email in the future for more feedback?',
    PART_YOU_ENJOY: 'What part of the training did you enjoy the most?',
    PART_YOU_ENJOY_LEAST: 'What part of the training did you enjoy the least?',
    BALANCE_THEORY_PRACTICAL:
        'The balance of theoretical and practical content was',
    OTHER_TOPIC_COVER:
        'What other topics would you like to see covered in the future?',
    OTHER_COMMENTS: 'Any other comments?',
    COLLECTOR_ID: 'Collector ID',
    INSTITUTION_YOU_AFFILIATED_TO:
        'Which Institution or Organisation are you affiliated to?',
    CAMBRIDGE_INSTITUTION_YOU_AFFILIATED_TO:
        'Which University of Cambridge department/institute are you affiliated to?',
}

const MULTI_COLUMNS_STARTS_ENUM = {
    CONTACT: 'Contact info:',
    PLEASE_RATE: 'Please rate',
}

const LOOK_FOR_ENUM = {
    ID: 'Respondent ID',
    COURSE_ADVERTISED: 'How did you hear about this event?',
    CAREER_STAGE: 'What is your career stage?',
    EMPLOYMENT_SECTOR: 'What is your employment sector?',
    EMPLOYMENT_COUNTRY: 'In what country do you work?',
    GENDER: 'What is your gender?',
    HAVE_YOU_USED_TOOLS_COVERED:
        'Have you used the tools/resources covered in the course before?',
    WILL_YOU_USE_TOOLS_COVERED:
        'Will you use the tools/resources covered in the course in your future work?',
    RECOMMEND_COURSE: 'Would you recommend this course?',
    OVERALL_RATING_ENTIRE_COURSE:
        'Please tell us your overall rating for the entire course.',
    MAY_CONTACT_EMAIL_FEEDBACK:
        'Do you consent to having your name and email recorded for the purposes of future contact as described above?',
    PART_YOU_ENJOY: 'What part of the course did you like the most?',
    PART_YOU_ENJOY_LEAST: 'What part of the course did you like the least?',
    BALANCE_THEORY_PRACTICAL:
        'The balance of theoretical and practical content across the course was',
    OTHER_TOPIC_COVER:
        'What other topics would you like to see covered in future training courses?',
    OTHER_COMMENTS: 'Any other comments?',
    COLLECTOR_ID: 'Collector ID',
    CONTACT:
        'Only enter the information below if you selected yes for the above question',
    INSTITUTION_YOU_AFFILIATED_TO:
        'Which Institution or Organisation are you affiliated to?',
    CAMBRIDGE_INSTITUTION_YOU_AFFILIATED_TO:
        'Which University of Cambridge department/institute are you affiliated to?',
    PLEASE_RATE: 'Please rate each section of the course.',
}

const IDENTIFIERS_COLUMNS = [
    {
        name: COLUMNS_ENUM.ID,
        additional: {
            type: COLUMN_TYPE.SINGLE,
            lookFor: LOOK_FOR_ENUM.ID,
        },
    },
]

const COMMON_HEADERS = [
    {
        name: COLUMNS_ENUM.COURSE_ADVERTISED,
        additional: {
            lookFor: LOOK_FOR_ENUM.COURSE_ADVERTISED,
            type: COLUMN_TYPE.OTHER,
        },
    },
    {
        name: COLUMNS_ENUM.CAREER_STAGE,
        additional: {
            lookFor: LOOK_FOR_ENUM.CAREER_STAGE,
            type: COLUMN_TYPE.OTHER,
        },
    },
    {
        name: COLUMNS_ENUM.EMPLOYMENT_SECTOR,
        additional: {
            lookFor: LOOK_FOR_ENUM.EMPLOYMENT_SECTOR,
            type: COLUMN_TYPE.OTHER,
        },
    },
    {
        name: COLUMNS_ENUM.EMPLOYMENT_COUNTRY,
        additional: {
            lookFor: LOOK_FOR_ENUM.EMPLOYMENT_COUNTRY,
            type: COLUMN_TYPE.SINGLE,
        },
    },
    {
        name: COLUMNS_ENUM.GENDER,
        additional: {
            lookFor: LOOK_FOR_ENUM.GENDER,
            type: COLUMN_TYPE.OTHER,
        },
    },
    {
        name: COLUMNS_ENUM.HAVE_YOU_USED_TOOLS_COVERED,
        additional: {
            lookFor: LOOK_FOR_ENUM.HAVE_YOU_USED_TOOLS_COVERED,
            type: COLUMN_TYPE.MERGE,
        },
    },
    {
        name: COLUMNS_ENUM.WILL_YOU_USE_TOOLS_COVERED,
        additional: {
            lookFor: LOOK_FOR_ENUM.WILL_YOU_USE_TOOLS_COVERED,
            type: COLUMN_TYPE.MERGE,
        },
    },
    {
        name: COLUMNS_ENUM.RECOMMEND_COURSE,
        additional: {
            lookFor: LOOK_FOR_ENUM.RECOMMEND_COURSE,
            type: COLUMN_TYPE.MERGE,
        },
    },
    {
        name: COLUMNS_ENUM.OVERALL_RATING_ENTIRE_COURSE,
        additional: {
            lookFor: LOOK_FOR_ENUM.OVERALL_RATING_ENTIRE_COURSE,
            type: COLUMN_TYPE.MERGE,
        },
    },
    {
        name: COLUMNS_ENUM.MAY_CONTACT_EMAIL_FEEDBACK,
        additional: {
            lookFor: LOOK_FOR_ENUM.MAY_CONTACT_EMAIL_FEEDBACK,
            type: COLUMN_TYPE.SINGLE,
        },
    },
    {
        name: COLUMNS_ENUM.PART_YOU_ENJOY,
        additional: {
            lookFor: LOOK_FOR_ENUM.PART_YOU_ENJOY,
            type: COLUMN_TYPE.SINGLE,
        },
    },
    {
        name: COLUMNS_ENUM.PART_YOU_ENJOY_LEAST,
        additional: {
            lookFor: LOOK_FOR_ENUM.PART_YOU_ENJOY_LEAST,
            type: COLUMN_TYPE.SINGLE,
        },
    },
    {
        name: COLUMNS_ENUM.BALANCE_THEORY_PRACTICAL,
        additional: {
            lookFor: LOOK_FOR_ENUM.BALANCE_THEORY_PRACTICAL,
            type: COLUMN_TYPE.SINGLE,
        },
    },
    {
        name: COLUMNS_ENUM.OTHER_TOPIC_COVER,
        additional: {
            lookFor: LOOK_FOR_ENUM.OTHER_TOPIC_COVER,
            type: COLUMN_TYPE.SINGLE,
        },
    },
    {
        name: COLUMNS_ENUM.OTHER_COMMENTS,
        additional: {
            lookFor: LOOK_FOR_ENUM.OTHER_COMMENTS,
            type: COLUMN_TYPE.SINGLE,
        },
    },
    {
        name: COLUMNS_ENUM.COLLECTOR_ID,
        additional: {
            lookFor: LOOK_FOR_ENUM.COLLECTOR_ID,
            type: COLUMN_TYPE.SINGLE,
        },
    },
]

const OTHER_HEADERS = [
    {
        name: MULTI_COLUMNS_STARTS_ENUM.CONTACT,
        additional: {
            type: COLUMN_TYPE.MULTI,
            lookFor: LOOK_FOR_ENUM.CONTACT,
        },
    },
    {
        name: COLUMNS_ENUM.INSTITUTION_YOU_AFFILIATED_TO,
        additional: {
            lookFor: LOOK_FOR_ENUM.INSTITUTION_YOU_AFFILIATED_TO,
            type: COLUMN_TYPE.OTHER,
        },
    },
    {
        name: COLUMNS_ENUM.CAMBRIDGE_INSTITUTION_YOU_AFFILIATED_TO,
        additional: {
            lookFor: LOOK_FOR_ENUM.CAMBRIDGE_INSTITUTION_YOU_AFFILIATED_TO,
            type: COLUMN_TYPE.OTHER,
        },
    },
    {
        name: MULTI_COLUMNS_STARTS_ENUM.PLEASE_RATE,
        additional: {
            type: COLUMN_TYPE.MULTI,
            lookFor: LOOK_FOR_ENUM.PLEASE_RATE,
        },
    },
]

module.exports = {
    IDENTIFIERS_COLUMNS,
    COMMON_HEADERS,
    OTHER_HEADERS,
    COLUMN_TYPE,
}
