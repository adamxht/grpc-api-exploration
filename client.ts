import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

// Path to your .proto file
const PROTO_PATH = 'proto/sbuilder.proto';

// Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const sbuilder = grpc.loadPackageDefinition(packageDefinition).sbuilder as any;

// Create a client instance
const client = new sbuilder.SBuilder(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Call the Chat method and handle the streaming response
function chatWithServer(question: string): void {
  const call = client.Chat({ question });

  process.stdout.write("Response from LLM: ");

  call.on('data', (response: any) => {
    process.stdout.write(`${response.text} `); // Append text side by side
  });

  call.on('end', () => {
    console.log('LLM Response ended.');
  });

  call.on('error', (err: grpc.ServiceError) => {
    console.error('Error:', err.message);
  });
}

// Example usage
chatWithServer('I am a coffee lover, where should I go?');
