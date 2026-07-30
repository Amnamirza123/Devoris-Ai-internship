from dotenv import load_dotenv
load_dotenv()
import json
import sys
import os

sys.path.append(
    os.path.dirname(
        os.path.dirname(__file__)
    )
)

from services.llm_service import generate_chat_stream


def run_test():

    with open("evaluation/test_cases.json") as file:
        tests = json.load(file)


    total = len(tests)
    passed = 0


    print("\nStarting Prompt Evaluation...\n")


    for index, test in enumerate(tests, start=1):

        prompt = test["prompt"]


        print(f"Test {index}/{total}")
        print("Prompt:", prompt)


        response = ""


        try:

            for chunk in generate_chat_stream(
                "evaluation-session",
                prompt,
                "You are a helpful AI assistant."
            ):
                response += chunk


            if response.strip():

                passed += 1
                status = "PASS"

            else:

                status = "FAIL"


        except Exception as e:

            status = "ERROR"
            response = str(e)



        print("Status:", status)
        print("Response preview:")
        print(response[:150])
        print("-"*50)



    print("\nEvaluation Complete")
    print(
        f"Score: {passed}/{total}"
    )

    print(
        f"Accuracy: {(passed/total)*100}%"
    )



if __name__ == "__main__":
    run_test()