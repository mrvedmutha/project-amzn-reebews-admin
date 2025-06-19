import { NextResponse } from "next/server";

export function successResponse(
  message: string = "Success",
  statusCode: number = 200,
  data: any = null
) {
  return NextResponse.json(
    {
      success: true,
      message: message,
      data,
    },
    {
      status: statusCode,
    }
  );
}

export function errorResponse(
  message: string = "Failed",
  statusCode: number = 500,
  error: any = null
) {
  return NextResponse.json(
    {
      success: false,
      message: message,
      error: error,
    },
    {
      status: statusCode,
    }
  );
}
