import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo';

const transactionalEmailsApi = new TransactionalEmailsApi();
transactionalEmailsApi.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!,
);

export async function sendOtpEmail({
  email,
  name,
  otp,
  companyName,
}: {
  email: string;
  name: string;
  otp: string;
  companyName: string;
}) {
  try {
    const sendSmtpEmail = {
      to: [{ email, name }],
      templateId: Number(process.env.BREVO_OTP_TEMPLATE),
      params: {
        OTP: otp,
        COMPANY_NAME: companyName,
        name: name,
      },
    };

    const response =
      await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    return { status: true };
  } catch (err: any) {
    console.error('OTP Email error:', err.response?.data || err);
    return { status: false, error: err.response?.data };
  }
}

export async function sendSubscriptionEmail({
  userEmail,
  planName,
  credits,
  expiry
}: {
  userEmail: string;
  planName: string;
  credits: number;
  expiry: string;
}) {
  return transactionalEmailsApi.sendTransacEmail({
    templateId: Number(process.env.BREVO_SUBSCRIPTION_TEMPLATE!), // replace with your subscription template id
    to: [{ email: userEmail }],
    params: {
      "user": userEmail,
      "planName": planName,
      "credits": credits,
      "expiry": expiry
    },
  });
}


export async function sendPublishEmail({
  creatorEmail,
  clientEmail,
  viewersEmails,
  name,
  greeting,
  cover,
  img1,
  img2,
  img3
}: {
  creatorEmail: string;
  clientEmail: string;
  viewersEmails: string[];
  name: string;
  greeting: string;
  cover:string;
  img1:string;
  img2:string;
  img3:string;
}) {
  return transactionalEmailsApi.sendTransacEmail({
    templateId: Number(process.env.BREVO_PUBLISH_TEMPLATE!), // replace with your publish template id
    to: [{ email: clientEmail }],
    cc: [{ email: creatorEmail }, ],
    bcc: viewersEmails.map((email) => ({ email })),
    params: {
      "name": name,
      "greeting": greeting,
      "cover":cover,
      "img1":img1,
      "img2":img2,
      "img3":img3
    },
  });
}
