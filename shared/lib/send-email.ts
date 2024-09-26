//функция для отправки письма с помощью пакета Resend

import { Resend } from 'resend'
// import React from 'react';

export const sendEmail = async (to: string, subject: string, template: React.ReactNode ) => {    

const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    // to: ['delivered@resend.dev'],
    to,//кому
    subject,//тема письма
    // react: PayOrderTemplate({ firstName: 'John' }),
    text: '',
    react: template,
  });

  if (error) {
    // return res.status(400).json(error);
    throw error
  }

  return data

}


