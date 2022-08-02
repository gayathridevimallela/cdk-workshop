import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as codedeploy from '@aws-cdk/aws-codedeploy';

export class LambdaStack extends cdk.Stack {
    public readonly lambdaCode: lambda.CfnParametersCode;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.lambdaCode = lambda.Code.fromCfnParameters();

        // lambda
        const fn = new lambda.Function(this, "MyLambda", {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'hello.handler',
            code: this.lambdaCode
        });

        // lambdaversion
        const version = fn.addVersion(new Date().toISOString());
        const alias = new lambda.Alias(this, 'LambdaAlias', {
            aliasName: 'Prod',
            version,
        });

        // codedeploy
        new codedeploy.LambdaDeploymentGroup(this, 'DeploymentGroup', {
            alias,
            deploymentConfig: codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
        });

    }
}