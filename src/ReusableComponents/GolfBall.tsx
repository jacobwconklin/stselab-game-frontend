import './GolfBall.scss';

// GolfBall
const GolfBall = (props: {size?: number, color?: string}) => {

    return (
        <div className='GolfBall' style={{
            width: props?.size ? props.size : '32px',
            height: props?.size ? props.size : '32px',
        }} >
            <div className='BackColor' style={{backgroundColor: props?.color ? props.color : 'white'}}>

            </div>
            <svg 
                style={{
                    width: props?.size ? props.size : '32px',
                    height: props?.size ? props.size : '32px',
                }}
                className='Shell' fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                width="800px" height="800px" viewBox="0 0 69.787 69.787"
                >
                <g>
                    <path d="M32.986,66.143c-2.564-1.354-3.708-1.365-5.809,0.236c-0.314-0.076-0.628-0.156-0.94-0.242
                        c-0.243-1.074,0.145-2.158,1.104-2.986c1.323-1.139,3.595-1.334,4.877-0.416C33.326,63.525,33.588,64.693,32.986,66.143z
                        M42.394,61.532c-1.236-0.669-3.148-0.296-4.465,0.872c-1.281,1.136-1.678,2.558-1.056,4.244c1.755-2.24,3.776-3.26,6.423-1.86
                        C43.736,63.075,43.448,62.1,42.394,61.532z M21.65,63.173c-0.968-0.758-2.434-0.956-3.66-0.589
                        c1.521,0.923,3.124,1.725,4.794,2.391C22.669,64.295,22.289,63.674,21.65,63.173z M51.105,59.695
                        c-1.574-0.174-2.713,0.727-3.629,1.883c-0.824,1.038-1.289,2.173-0.886,3.559c0.294-0.113,0.584-0.229,0.873-0.349
                        c1.086-1.274,2.261-2.259,3.995-2.004c0.359-0.212,0.717-0.429,1.064-0.651C52.816,60.814,52.304,59.829,51.105,59.695z
                        M49.109,53.766c0.078-1.519-0.451-2.552-1.764-2.959c-1.596-0.496-2.898,0.195-3.933,1.377c-1.037,1.188-1.531,2.541-1.069,3.938
                        c0.947-0.923,1.784-1.976,2.844-2.708C46.424,52.555,47.795,52.956,49.109,53.766z M54.058,42.518
                        c-0.109-1.395-0.439-2.562-1.728-3.174c-1.146-0.547-2.185-0.217-3.101,0.579c-1.268,1.101-1.693,2.697-1.203,4.449
                        C49.851,41.109,51.595,40.54,54.058,42.518z M52.365,54.766c1.521-3.313,2.863-4.137,5.316-3.187
                        c0.016-2.021-1.021-3.097-2.488-2.713C53.021,49.432,51.478,52.65,52.365,54.766z M61.28,40.441
                        c-0.13-0.555-0.112-1.066-0.354-1.379c-0.514-0.664-1.129-1.664-1.764-1.711c-0.734-0.057-1.744,0.596-2.264,1.238
                        c-0.916,1.139-0.946,2.584-0.647,4.156C57.754,39.331,58.892,38.797,61.28,40.441z M59.677,25.923
                        c-1.252,0.188-1.845,1.824-1.465,4.051c1.432-2.374,2.239-2.471,4.329-0.411C62.22,27.204,61.009,25.727,59.677,25.923z
                        M33.424,52.578c-1.645,1.044-2.306,2.982-1.613,4.738c1.418-3.987,2.864-4.939,6.436-4.076
                        C36.902,51.742,35.068,51.537,33.424,52.578z M22.131,53.236c-1.522,1.074-2.005,3-1.127,4.488
                        c0.309-3.498,2.507-4.851,6.248-3.845C25.918,52.33,23.793,52.062,22.131,53.236z M43.769,41.934
                        c-1.094-1.315-2.795-1.623-4.287-0.818c-1.731,0.934-2.707,3.49-1.77,5.179C38.273,42.473,40.207,41.117,43.769,41.934z
                        M55.353,28.83c-0.91-0.967-1.871-1.36-3.022-0.685c-1.345,0.787-1.841,2.768-1.194,4.535
                        C51.745,29.366,52.595,28.566,55.353,28.83z M60.599,16.398c0.026-0.109,0.055-0.218,0.082-0.328
                        c-0.66-0.13-1.572-0.598-1.937-0.327c-1.088,0.81-0.685,2.01-0.321,3.491C58.54,16.76,58.937,16.308,60.599,16.398z M69.754,34.926
                        c0,19.225-15.639,34.861-34.861,34.861c-19.224,0-34.861-15.639-34.861-34.861c0-11.481,5.582-21.685,14.172-28.039
                        C19.978,2.564,27.143,0,34.894,0c7.514,0,14.477,2.411,20.155,6.496C63.943,12.82,69.754,23.207,69.754,34.926z M64.245,48.729
                        c-0.011-0.561-0.327-1.188-0.468-1.775c-0.953,2.32-1.129,4.967-4.818,5.384c0.684,0.871,1.122,1.942,1.669,2.001
                        c0.075,0.008,0.157,0.006,0.24,0.001C62.172,52.596,63.306,50.717,64.245,48.729z M66.631,41.637
                        c0.271-1.285,0.466-2.597,0.58-3.932c-0.11-0.85-0.366-1.637-0.786-2.205c-0.389,2.047,0.104,4.602-3.139,5.205
                        c0.186,0.43,0.337,0.995,0.646,1.458c0.623,0.937,1.477,0.963,2.231,0.149C66.341,42.124,66.498,41.893,66.631,41.637z
                        M34.894,67.365c7.364,0,14.161-2.469,19.612-6.618c-0.248,0.187-0.496,0.373-0.751,0.554c0.068-0.119,0.136-0.24,0.207-0.354
                        c0.622-0.989,1.28-2.237,2.24-2.678c2.543-1.16,2.967-2.928,2.537-5.276c-0.433-2.367-0.089-4.454,1.672-6.197
                        c1.933-1.915,2.368-4.217,1.823-6.813c-0.407-1.938,0.156-3.672,1.484-5.09c0.756-0.81,1.643-1.539,2.584-2.125
                        c0.344-0.216,0.643-0.449,0.9-0.697c-0.188-2.132-0.58-4.205-1.161-6.199c-0.69-0.412-1.181-0.053-1.795,0.993
                        c-0.067-0.033-0.192-0.068-0.192-0.1c0.014-1.156-0.498-2.819,0.905-3.142c0.115-0.026,0.22-0.036,0.32-0.041
                        C60.671,11.274,48.79,2.489,34.894,2.489c-17.888,0-32.438,14.552-32.438,32.439c0,7.848,2.802,15.053,7.456,20.668
                        c0.025-1.133,0.532-2.018,1.465-2.617c1.578-1.014,3.288-0.744,5.161,1.07c-1.653-0.725-2.979-0.99-4.302-0.254
                        c-0.985,0.549-1.539,1.344-1.801,2.415c1.443,1.657,3.053,3.166,4.8,4.5c0.886,0.669,1.804,1.3,2.756,1.875
                        c-0.007,0.003-0.011,0.005-0.019,0.007C22.902,65.618,28.698,67.365,34.894,67.365z"/>
                </g>
            </svg>
        </div>
    )
}

export default GolfBall;