// @ts-ignore
import {
    ConnectClient,
    StartTaskContactCommand,
} from "@aws-sdk/client-connect";
import { AssumeRoleCommand, STSClient } from "@aws-sdk/client-sts";

exports.handler = async function (event: unknown): Promise<void> {
    console.log("request:", JSON.stringify(event, undefined, 2));
    const stsClient = new STSClient({ region: "us-east-1" });
    const assumeRoleCommand = new AssumeRoleCommand({
        RoleArn:
            "arn:aws:iam::160071257600:role/test-lambda-connect-role",
        RoleSessionName: "test-connect",
    });
    var credsResponse;
    try {
        credsResponse = await stsClient.send(assumeRoleCommand);
    } catch (error) {
        console.log("Error whilst fetching creds", error);
    }

    const connectClient = new ConnectClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: credsResponse?.Credentials?.AccessKeyId ?? "",
            secretAccessKey: credsResponse?.Credentials?.SecretAccessKey ?? "",
            sessionToken: credsResponse?.Credentials?.SessionToken,
        },
    });
    const startTaskContactCommand = new StartTaskContactCommand({
        InstanceId: "2fa874e3-f165-40ed-a6eb-159a247b6c9d",
        Name: "Pritam - Test task",
        Description: `Testing connecting to Amazon Connect at ${Date.now()}`,
        ContactFlowId: "de546fe5-b2b6-46c6-a7a2-7888afb629fb",
        Attributes: {
            chargePointRef: "12345",
            commentDateTime: Date.now().toString()
        }
    });
    try {
        await connectClient.send(startTaskContactCommand);
    } catch (error) {
        console.log("Error whilst creating task in connect", error);
    }
};
