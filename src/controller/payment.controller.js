const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

exports.stripePayment = (req, res) => {
    const fromDate = moment();
    const toDate = moment().add(10, 'years');
    const range = moment().range(fromDate, toDate);

    const years = Array.from(range.by('year')).map(m => m.year());
    const months = moment.monthsShort();

    // Respond with the available months and years (if needed for frontend)
    res.json({ months, years });
};

exports.payment = async (req, res) => {
    const { cardNumber, month, year, cvv } = req.body;

    try {
        // Create token
        const token = await stripe.tokens.create({
            card: {
                number: cardNumber,
                exp_month: month,
                exp_year: year,
                cvc: cvv
            }
        });

        // Create charge
        const charge = await stripe.charges.create({
            amount: 2000, // Amount in cents
            currency: 'usd',
            source: token.id,
            description: 'My first payment'
        });

        // Respond with the status
        if (charge.status === 'succeeded') {
            return res.status(200).json({ success: true, message: 'Payment completed.' });
        } else {
            return res.status(400).json({ success: false, message: 'Payment failed.' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: `Payment failed: ${error.message}` });
    }
};
