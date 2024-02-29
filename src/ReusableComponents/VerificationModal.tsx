import { Button } from "antd";
import './VerificationModal.scss';

// Flexible verification modal to give users a second chance before removing others from a session or leaving their own session
const VerificationModal = (props: {
    cancel: () => void,
    confirm: () => void,
    title: string;
    message: string;
}) => {

    // props needs to have:
    // cancel: function to close the modal without action
    // confirm: handles action and closes modal too
    // title for modal and message for modal text (could have defaults but don't currently)

    return (
        <div className='VerificationModal'
            style={{margin: '0px'}}
            onClick={() => props.cancel()}
        >
            <div className='ModalBody'>
                <h1 className='title-font'> {props.title} </h1>
                <p> {props.message} </p>
                <br />
                <div className='ModalButtons'>
                    <Button
                        onClick={ async () => {
                            props.confirm();
                        }}
                    >
                        Confirm
                    </Button>
                    <Button
                        type="primary"
                        onClick={ async() => {
                            props.cancel();
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default VerificationModal;