let except=require('except')
var {generateMessage}=require('./message')

describe('generate Message',()=>{
    it("should generate correct message object",()=>{
        let from ="WDJ",
            text="Some random text"
            message=generateMessage(from,text);

    except(typeof message.createdAt).toBe('number');
    except(message).toMatchObject({from,text})
    });
})