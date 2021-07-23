# BeatEst

![Project Banner](https://github.com/adildsw/BeatEst/blob/main/web/assets/banner.png)

_BeatEst_ is a server-based web application for estimating the rhythm perception of individuals. Over a parameterized BPM, beats are played and the user is supposed to tap along with the beat for a fixed, short duration. The beat volume eventually seizes and the user is required to continue tapping along the perceived beat until the timer runs out. Once the timer runs out, the system generates a result describing the latency of every tap made by the user.

## Getting Started
You can get _BeatEst_ up and running on your system by following the instructions below!

### Prerequisites
In order to run _BeatEst_, please make sure your device meets the following requirements:

##### 1. **[Python 3.6+](https://www.python.org/downloads/)** ([Anaconda](https://www.anaconda.com/products/individual) distribution recommended)
##### 2. **[Flask](https://pypi.org/project/Flask/)** (included in the [Anaconda](https://www.anaconda.com/products/individual) distribution)

### Running BeatEst
Once all the prerequisites are met, you can now run _BeatEst_ by following the instructions below:

#### 1. Clone BeatEst repository to your local system.
Open terminal and type the following command:
```
git clone https://github.com/adildsw/BeatEst
```

#### 2. Navigate to the cloned directory.
In the terminal, type the following command:
```
cd BeatEst
```

#### 3. Starting BeatEst
Once in the BeatEst directory, you can launch the application by typing the following command in the terminal:
```
python app.py
```
If everything is done correctly, _BeatEst_ should open up in the browser automatically. Alternatively, _BeatEst_ can be launched by opening any browser and entering the address `http://127.0.0.1:5000`

![BeatEst Screenshot](https://github.com/adildsw/BeatEst/blob/main/web/assets/screenrec.gif)

## Configuration
_BeatEst_ offers some parameters which can be configured through command-based arguments provided at launch.

### Hosting BeatEst over a network
_BeatEst_ has the functionality allowing users to host the application in custom address to allow for multi-device access over a network. This can be done by using the `ip` and `port` argument while launching the application.
```
python app.py --ip <IP> --port <PORT>
```
**NOTE:** The default IP is set to `127.0.0.1`, and the default port is set to `5000`.

### Changing BPM of the application
The speed at which the beat plays can be configured by using the `bpm` argument while launching the application.
```
python app.py --bpm <BPM>
```
**NOTE:** The default BPM is set to `120`.
