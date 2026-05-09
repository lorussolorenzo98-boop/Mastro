import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendBookingConfirmation = async (clientEmail, bookingDetails) => {
    const msg = {
        to: clientEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Richiesta di prenotazione ricevuta — Mastro',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #1a2e1a; padding: 24px; text-align: center;">
                    <h1 style="color: #fff; margin: 0;">Mastr<span style="color: #c8f135;">o</span></h1>
                </div>
                <div style="padding: 32px;">
                    <h2 style="color: #1a2e1a;">Prenotazione ricevuta! ✓</h2>
                    <p style="color: #5a6b5a;">La tua richiesta di prenotazione è stata ricevuta con successo.</p>
                    
                    <div style="background: #f7f7f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
                        <p><strong>Data:</strong> ${bookingDetails.date}</p>
                        <p><strong>Fascia oraria:</strong> ${bookingDetails.timeSlot}</p>
                        <p><strong>Indirizzo:</strong> ${bookingDetails.address}</p>
                        <p><strong>Importo pagato:</strong> ${bookingDetails.amount}€</p>
                    </div>

                    <p style="color: #5a6b5a;">Il professionista ti contatterà a breve per confermare l'appuntamento.</p>
                    
                    <a href="http://localhost:5173/dashboard" 
                       style="display: inline-block; background: #c8f135; color: #1a2e1a; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-top: 16px;">
                        Vai alla dashboard
                    </a>
                </div>
                <div style="background: #f7f7f5; padding: 16px; text-align: center;">
                    <p style="color: #5a6b5a; font-size: 12px; margin: 0;">© 2025 Mastro — Tutti i diritti riservati</p>
                </div>
            </div>
        `
    }

    await sgMail.send(msg)
}

export const sendBookingConfirmed = async (clientEmail, bookingDetails) => {
    const msg = {
        to: clientEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Prenotazione confermata — Mastro',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #1a2e1a; padding: 24px; text-align: center;">
                    <h1 style="color: #fff; margin: 0;">Mastr<span style="color: #c8f135;">o</span></h1>
                </div>
                <div style="padding: 32px;">
                    <h2 style="color: #1a2e1a;">Il professionista ha confermato! 🎉</h2>
                    <p style="color: #5a6b5a;">La tua prenotazione è stata confermata dal professionista.</p>
                    <div style="background: #f7f7f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
                        <p><strong>Data:</strong> ${bookingDetails.date}</p>
                        <p><strong>Fascia oraria:</strong> ${bookingDetails.timeSlot}</p>
                        <p><strong>Indirizzo:</strong> ${bookingDetails.address}</p>
                        <p><strong>Importo:</strong> ${bookingDetails.amount}€</p>
                    </div>
                    <a href="http://localhost:5173/dashboard" style="display: inline-block; background: #c8f135; color: #1a2e1a; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                        Vai alla dashboard
                    </a>
                </div>
                <div style="background: #f7f7f5; padding: 16px; text-align: center;">
                    <p style="color: #5a6b5a; font-size: 12px; margin: 0;">© 2025 Mastro — Tutti i diritti riservati</p>
                </div>
            </div>
        `
    }
    await sgMail.send(msg)
}

export const sendBookingCancelled = async (clientEmail, bookingDetails) => {
    const msg = {
        to: clientEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Prenotazione rifiutata — Mastro',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #1a2e1a; padding: 24px; text-align: center;">
                    <h1 style="color: #fff; margin: 0;">Mastr<span style="color: #c8f135;">o</span></h1>
                </div>
                <div style="padding: 32px;">
                    <h2 style="color: #cc0000;">Prenotazione rifiutata</h2>
                    <p style="color: #5a6b5a;">Purtroppo il professionista non è disponibile per questa prenotazione.</p>
                    <div style="background: #f7f7f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
                        <p><strong>Data:</strong> ${bookingDetails.date}</p>
                        <p><strong>Fascia oraria:</strong> ${bookingDetails.timeSlot}</p>
                        <p><strong>Importo:</strong> ${bookingDetails.amount}€</p>
                    </div>
                    <p style="color: #5a6b5a;">Riceverai un rimborso completo entro 5-7 giorni lavorativi.</p>
                    <a href="http://localhost:5173/professionals" style="display: inline-block; background: #c8f135; color: #1a2e1a; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                        Cerca un altro professionista
                    </a>
                </div>
                <div style="background: #f7f7f5; padding: 16px; text-align: center;">
                    <p style="color: #5a6b5a; font-size: 12px; margin: 0;">© 2025 Mastro — Tutti i diritti riservati</p>
                </div>
            </div>
        `
    }
    await sgMail.send(msg)
}