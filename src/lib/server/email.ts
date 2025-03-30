import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } from "$env/static/private";

interface EmailParams {
  to: string | string[];
  from: string;
  subject: string;
  body: {
    html?: string;
    text?: string;
  };
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
}

interface EmailResult {
  messageId: string;
  requestId: string;
  timestamp: string;
}

// Define AWS SES-specific types
interface SESDestination {
  ToAddresses: string[];
  CcAddresses?: string[];
  BccAddresses?: string[];
}

interface SESCommandParams {
  Source: string;
  Destination: SESDestination;
  Message: {
    Subject: { Data: string };
    Body: {
      Text: { Data: string };
      Html?: { Data: string };
    };
  };
  ReplyToAddresses?: string[];
}

export async function sendEmail(params: EmailParams): Promise<EmailResult> {
  const requestId = crypto.randomUUID();

  try {
    const sesClient = new SESClient({
      region: AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Prepare destination with proper typing
    const destination: SESDestination = {
      ToAddresses: Array.isArray(params.to) ? params.to : [params.to],
    };

    // Add optional destination addresses if provided
    if (params.cc) {
      destination.CcAddresses = Array.isArray(params.cc) ? params.cc : [params.cc];
    }

    if (params.bcc) {
      destination.BccAddresses = Array.isArray(params.bcc) ? params.bcc : [params.bcc];
    }

    // Prepare the command with all parameters
    const commandParams: SESCommandParams = {
      Source: params.from,
      Destination: destination,
      Message: {
        Subject: { Data: params.subject },
        Body: {
          Text: { Data: params.body.text || "" },
          Html: params.body.html ? { Data: params.body.html } : undefined,
        },
      },
    };

    // Add ReplyToAddresses if provided
    if (params.replyTo) {
      commandParams.ReplyToAddresses = Array.isArray(params.replyTo)
        ? params.replyTo
        : [params.replyTo];
    }

    const command = new SendEmailCommand(commandParams);
    const response = await sesClient.send(command);

    if (!response.MessageId) {
      throw new Error("No message ID returned from AWS SES");
    }

    return {
      messageId: response.MessageId,
      requestId,
      timestamp: new Date().toISOString(),
    };
  }
  catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to send email");
  }
}
