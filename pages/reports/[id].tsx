import { useRouter } from "next/router";
import React from "react";

function ReportDetail() {
  const router = useRouter();
  const id = router.query["id"] as string;
  return <h1>{id}</h1>;
}

export default ReportDetail;
