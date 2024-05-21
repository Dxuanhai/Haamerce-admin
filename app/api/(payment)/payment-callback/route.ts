import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json("Hello world!");
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🚀  / POST  / body:", body);
    return NextResponse.json(body);
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
