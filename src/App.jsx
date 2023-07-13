import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react"
import { useState } from "react"


function App() {
  // state messages
  const [messages, setMessages] = useState([
    {
      message: "Hallo I'm ChatGPT!",
      direction: "incoming",
      position: "last"
    }
  ])
  // state typing
  const [typing, setTyping] = useState(false)

  // function handleMessage
  const handleMessage = (input) => {
    // set newMessage
    const newMessage = {
      message: input,
      direction: "outgoing",
      position: "last"
    }

    const allMessages = [...messages, newMessage]

    // update state messages
    setMessages(allMessages)
    // set typing indicator true
    setTimeout(() => {
      setTyping(true)
    }, 600)

    // send message to chatGPT to get response
    sendChatToChatGPT(allMessages)
  }

  // function sendChatToChatGPT
  const sendChatToChatGPT = async (allMessages) => {
    // get latest message from allMessages
    const text = allMessages[allMessages.length -1];

    const API_KEY = "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";
    const API_URL ="https://api.openai.com/v1/chat/completions";

    // option api
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "user",
            content: text.message
          }
        ]
      })
    }

    // fetching API
   await fetch(API_URL, options)
    .then((result) => result.json())
    .then((data) => {
      console.log(data.choices[0].message.content)
      setMessages([
        ...allMessages,
        {
          message: data.choices[0].message.content,
          direction: "incoming",
          position: "last"
        }
      ])

      setTyping(false)
    })
    .catch((err) => {
      setMessages([
        ...allMessages,
        {
          message: `Opps! something wrong! try again later! ${err}`,
          direction: "incoming",
          position: "last"
        }
      ])
    })
  }

  return (
    <>
      <div className="w-full fixed top-[55px] bottom-0">
        <MainContainer>
          <ChatContainer>
            <MessageList typingIndicator={ typing ? <TypingIndicator content="ChatGPT is typing..." /> : null} style={{scrollBehavior: "smooth"}}>
              {messages.map((message, i) => {
                return(
                  <Message model={message} key={i} />
                )
              })}
            </MessageList>
            <MessageInput onSend={handleMessage} placeholder="Enter Message here..."/>
          </ChatContainer>
        </MainContainer>
        </div>
    </>
  )
}

export default App
