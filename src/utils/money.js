export const money = {
    type: Number,
    min: 0,
    default: 0,
    validate: {
        validator: Number.isInteger,
        message: 'Amount paise me (whole number) hona chahiye',
    },
};


export const toRupees = (paise) => paise / 100;
export const toPaise = (rupees) => Math.round(rupees * 100);


export const qty = {
    type: Number,
    required: true,
    min: 1,
    validate: {
        validator: Number.isInteger,
        message: 'Quantity whole number honi chahiye',
    },
};