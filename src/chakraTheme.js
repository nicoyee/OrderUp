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
        Popover: {
            baseStyle: {
                content: {
                    bg: '#151515',
                    w: '250px',
                    border: '#29292c',
                    "--popper-arrow-shadow-color": '#151515',
                },
                header: {
                    p: '10px',
                    borderColor: '#29292c',
                },
                body: {
                    bg: 'none',
                    padding: '5px',
                    maxHeight: '200px',
                    overflow: 'auto',
                    '::-webkit-scrollbar-thumb': {
                        background: '#888',
                    },
                },
                footer: {
                    p: '10px',
                    borderColor: '#29292c',
                    display: 'flex',
                    justifyContent: 'flex-end',
                },
            },
        },
        Menu: {
            baseStyle: {
                list: {
                    bg: '#151717',
                    borderColor: '#29292c',
                },
                item: {
                    color: 'white',
                    py: '10px',
                    px: '20px',
                    bg: '#151717',
                    _hover: {
                        bg: 'blackAlpha.800',
                    },
                },
            },
        },
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
        Avatar: {
            baseStyle: {
              container: {
                boxSize: '2.5rem',
                '--avatar-font-size': '1px',
              },
            },
          },
    },
});

export default theme;