import { InputAddon, InputLeftAddon, InputLeftElement, background, extendTheme } from "@chakra-ui/react";
import { CiTextAlignCenter } from "react-icons/ci";

const theme = extendTheme({
    colors: {
        error: 'red.500',
        textDefault: '#d5dbbd',
        textAlt: '#f05006',
    },
    styles: {
        global: {
            body: {
                bg: "#252525",
                color: "textDefault",
            },
        },
    },
    components: {
        Modal: {
            baseStyle: {
                dialog: {
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
                    color: 'black',
                    h3: {
                        fontSize: '14px',
                        fontWeight: 600,
                    },
                    h4: {
                        fontSize: '12px',
                    },
                },
                header: {
                    padding: '20px 30px 20px 30px',
                    h1: {
                        fontSize: '28px',
                        fontWeight: 700,
                    },
                    h2: {
                        fontSize: '14px',
                        color: 'blackAlpha.700',
                    }
                },
                closeButton: {
                    borderRadius: 'full',
                },
            },
            variants: {
                auth: {
                    dialog: {
                        width: '400px',
                    },
                },
            },
        },
    },
});

export default theme;