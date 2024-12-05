from concurrent import futures
import grpc
import sbuilder_pb2
import sbuilder_pb2_grpc
import time

# Implement the service defined in the proto file
class LLM(sbuilder_pb2_grpc.SBuilderServicer):
    
    def Chat(self, request, context):
        print(f"Received question: {request.question}")
        llm_response = "<Starlucks> You should visit **Starlucks**! It's a cozy coffeehouse where you can enjoy premium snacks and drinks in a warm and inviting ambiance. Perfect for a delightful treat!"
        tokens = llm_response.split()
        for token in tokens:
            yield sbuilder_pb2.TextStreamer(text=token)
            time.sleep(0.2)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    sbuilder_pb2_grpc.add_SBuilderServicer_to_server(LLM(), server)
    server.add_insecure_port('[::]:50051')
    print("Server is running on port 50051...")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
