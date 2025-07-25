import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { EventProvider } from '../context/EventContext';
import { MessageProvider } from '../context/MessageContext';
import { PostProvider } from '../context/PostContext';
import { ReportProvider } from '../context/ReportContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <EventProvider>
        <MessageProvider>
          <PostProvider>
            <ReportProvider>
              <Head>
                <title>Alumni Connect Portal</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              </Head>
              <Component {...pageProps} />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </ReportProvider>
          </PostProvider>
        </MessageProvider>
      </EventProvider>
    </AuthProvider>
  );
}

export default MyApp;
