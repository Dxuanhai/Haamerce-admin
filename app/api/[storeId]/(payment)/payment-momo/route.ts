// app/api/momo-payment/route.js
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";
export async function GET(req: Request) {
  try {
    const profiles = await prismadb.profile.findMany({});

    return NextResponse.json(profiles);
  } catch (error) {
    //@ts-ignore
    console.log("[COLORS_GET]", error?.message);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  const url = process.env.URL_CALLBACK;
  const urlClient = process.env.URL_CLIENT;

  const partnerCode = "MOMO";
  const accessKey = "F8BBA842ECF85";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const requestId = partnerCode + new Date().getTime();
  const orderId = requestId;
  const orderInfo = "pay with MoMo";
  const redirectUrl = `${urlClient}/checkout/method/complete`;
  const ipnUrl = `${url}/payment-callback`;
  const amount = body.amount;

  const requestType = "captureWallet";
  const extraData = ""; // pass empty value if your merchant does not have stores

  // Create the raw signature
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  console.log("--------------------RAW SIGNATURE----------------");
  console.log(rawSignature);

  // Create the signature
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  console.log("--------------------SIGNATURE----------------");
  console.log(signature);

  // Create the request body
  const requestBody = {
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "vi",
  };

  try {
    // Send the request to MoMo API
    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Status: ${response.status}`);
    console.log(`Headers: ${JSON.stringify(response.headers)}`);
    console.log("Body: ");
    console.log(response.data);

    // Return the response data
    return NextResponse.json(response.data);
  } catch (error) {
    //@ts-ignore
    if (error.response) {
      //@ts-ignore
      // The request was made and the server responded with a status code outside of the range of 2xx
      console.error("Response data:", error.response.data); //@ts-ignore
      console.error("Response status:", error.response.status); //@ts-ignore
      console.error("Response headers:", error.response.headers);
      return NextResponse.json({
        message: "Bad Request",
        error: {
          responseTime: new Date().getTime(), //@ts-ignore
          message: error.response.data.message, //@ts-ignore
          resultCode: error.response.data.resultCode || 20, //@ts-ignore
        },
      }); //@ts-ignore
    } else if (error.request) {
      //@ts-ignore
      // The request was made but no response was received
      console.error("Request data:", error.request); //@ts-ignore
      return NextResponse.json({
        message: "No Response",
        error: {
          responseTime: new Date().getTime(),
          message: "No response received from MoMo API.",
          resultCode: 21,
        },
      });
    } else {
      //@ts-ignore
      // Something happened in setting up the request that triggered an Error
      console.error("Error", error.message);
      return NextResponse.json({
        message: "Internal Server Error",
        error: {
          responseTime: new Date().getTime(), //@ts-ignore
          message: error.message,
          resultCode: 22,
        },
      });
    }
  }
}
