//import React, { useEffect } from "react";
//import { getCoreBalance } from "./tools/getCoreBalance"; // your client-side tool
//import { useAccount } from "wagmi";

//interface GetCoreBalanceInvocationProps {
//  toolCallId: string;
//  toolInvocation: any; // Replace 'any' with the appropriate type if known
//  addToolResult?: (result: { toolCallId: string; result: any }) => void; // Replace 'any' with the appropriate type if known
//}

//const GetCoreBalanceInvocation: React.FC<GetCoreBalanceInvocationProps> = ({ toolCallId, toolInvocation, addToolResult }) => {
//  const { address } = useAccount();

//  useEffect(() => {
//    if (!("result" in toolInvocation) && address) {https://prod.liveshare.vsengsaas.visualstudio.com/join?BD0D69531154BD00A1D3264B64B6585536E0
//      getCoreBalance.execute({ walletAddress: address, chain: "core" })
//        .then((result: any) => {
//          addToolResult && addToolResult({ toolCallId, result });
//        })
//        .catch((error: any) => {
//          addToolResult && addToolResult({ toolCallId, result: `Error: ${error.message}` });
//        });
//    }
//  }, [toolCallId, toolInvocation, address, addToolResult]);

//  return (
//    <div className="mt-2">
//      Checking your CORE balance...
//    </div>
//  );
//};

//export default GetCoreBalanceInvocation;