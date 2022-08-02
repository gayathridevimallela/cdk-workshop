#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {PipelineStack} from "../lib/pipeline-stack";
import {LambdaStack} from "../lib/lambda-stack";

if (!process.env.GITHUB_TOKEN) {
    console.log("No Github Token present");
}

const app = new cdk.App();
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
    env: {
        region: "us-east-1"
    }
});
new PipelineStack(app, 'PipelineStack', {
    lambdaCode: lambdaStack.lambdaCode,
    githubToken: process.env.GITHUB_TOKEN || "",
    env: {
        region: "us-east-1",
    }
});

app.synth();