import { document } from './../utils/dynamodbClient';
import { APIGatewayProxyHandler } from 'aws-lambda';


interface IUserCertificate {
  name: string;
  id: string;
  grade: string;
  created_at: string;

}

export const handler: APIGatewayProxyHandler = async (event) => {

  const { id } = event.pathParameters;

  const res = await document
    .query({
      TableName: "users_certificate",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      }
    })
    .promise();

  const userCertificate = res.Items[0] as IUserCertificate;

  if (userCertificate) {
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Certificado válido.",
        name: userCertificate.name,
        url: `https://certificate-serverless-rocketseat.s3.sa-east-1.amazonaws.com/${id}.pdf`
      })
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Certificado inválido.",
    })
  }

}