import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import ExpandIcon from '@material-ui/icons/ArrowDropDown'
import { MODES as modes } from '../../config/constants'
import {
  Button,
  ButtonBase,
  ButtonGroup,
  Grid,
  SwipeableDrawer,
} from '@material-ui/core'
import { Mode } from 'src/interfaces'

const useStyles = makeStyles((theme) => ({
  button: {
    background: theme.palette.background.paper,
    textAlign: 'left',
    minHeight: 48,
    height: 48,
  },
  buttonContainer: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
  },
  currentMode: {
    fontSize: 14,
    fontWeight: 500,
    flexGrow: 1,
  },
  expandIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  drawer: {
    margin: theme.spacing(0, 0, 2, 0),
  },
  drawerHeaderText: {
    fontFamily: 'Google Sans',
    fontSize: 24,
    fontWeight: 500,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}))

type ShowMode = 'top' | 'new'
const showModes: { text: string; mode: ShowMode }[] = [
  {
    text: 'Новые',
    mode: 'new',
  },
  {
    text: 'Лучшие',
    mode: 'top',
  },
]

// Bad thing to do, but who cares. Checker doesn't know about browser process,
// so it shows an error, thinking it's NodeJS `process`
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//@ts-ignore
const isIOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)

/**
 * TODO: Optimize button blocks
 */
const Switcher = ({ handleClick, mode, setMode }) => {
  const [isOpen, setOpen] = useState(false)
  const [showMode, setShowMode] = useState<ShowMode>(
    mode !== 'all' ? 'top' : 'new'
  )
  const current = modes.find((e) => e.mode === mode)
  const [drawerMode, setDrawerMode] = useState<Mode>(current)
  const classes = useStyles()

  const onButtonClick = () => {
    setOpen((prev) => !prev)
  }
  const handleShowModeChange = (newShowMode: ShowMode) => {
    newShowMode !== showMode && setShowMode(newShowMode)
  }
  const handleDrawerModeClick = (newMode: Mode) => {
    setDrawerMode(newMode)
  }
  const handleApplyClick = () => {
    setMode(drawerMode.mode)
    handleClick(drawerMode)
    setOpen(false)
  }

  return (
    <>
      <ButtonBase className={classes.button} onClick={onButtonClick}>
        <Container className={classes.buttonContainer}>
          <Typography className={classes.currentMode}>
            {current.text}
          </Typography>
          <div className={classes.expandIcon}>
            <ExpandIcon />
          </div>
        </Container>
      </ButtonBase>

      <SwipeableDrawer
        open={isOpen}
        anchor="bottom"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableBackdropTransition={!isIOS}
        disableDiscovery={isIOS}
        disableSwipeToOpen
      >
        <Container className={classes.drawer}>
          <Typography className={classes.drawerHeaderText}>
            Сначала показывать
          </Typography>
          <ButtonGroup disableElevation color="primary">
            {showModes.map((e, i) => (
              <Button
                onClick={() => handleShowModeChange(e.mode)}
                variant={e.mode === showMode ? 'contained' : 'outlined'}
                key={i}
              >
                {e.text}
              </Button>
            ))}
          </ButtonGroup>

          {/** Block for 'new' showMode */}
          {showMode === 'new' && (
            <>
              <Typography className={classes.drawerHeaderText}>
                Порог рейтинга
              </Typography>
              <Button
                disableElevation
                color="primary"
                variant={'all' === drawerMode.mode ? 'contained' : 'outlined'}
                onClick={() =>
                  handleDrawerModeClick(modes.find((e) => e.mode === 'all'))
                }
              >
                Все подряд
              </Button>
            </>
          )}

          {/** Block for 'top' showMode */}
          {showMode === 'top' && (
            <>
              <Typography className={classes.drawerHeaderText}>
                Период
              </Typography>
              <Grid container spacing={1}>
                {modes
                  .filter((e) => e.periodText)
                  .map((e, i) => (
                    <Grid item key={i}>
                      <Button
                        disableElevation
                        onClick={() => handleDrawerModeClick(e)}
                        color="primary"
                        variant={
                          e.mode === drawerMode.mode ? 'contained' : 'outlined'
                        }
                      >
                        {e.periodText}
                      </Button>
                    </Grid>
                  ))}
              </Grid>
            </>
          )}
        </Container>
        <Button
          color="primary"
          disableElevation
          style={{ height: 48, borderRadius: 0 }}
          fullWidth
          variant="contained"
          onClick={handleApplyClick}
        >
          Применить
        </Button>
      </SwipeableDrawer>
    </>
  )
}

// const Switcher = ({ handleClick, mode, setMode }) => {
//   const [isExpanded, setExpanded] = React.useState(false)
//   const ListButton = ({ data }) => {
//     const isNotCurrent = data.mode !== current.mode
//     const handleClickWrapped = () => {
//       if (isNotCurrent) {
//         setExpanded(false)
//         setMode(data.mode)
//         handleClick(data)
//       }
//     }

//     return (
//       <ListItem
//         onClick={handleClickWrapped}
//         button={isNotCurrent as true | undefined}
//         className={classes.item}
//       >
//         <ListItemText
//           primaryTypographyProps={{
//             className: isNotCurrent ? classes.text : classes.textSelected,
//           }}
//         >
//           {data.text}
//         </ListItemText>
//       </ListItem>
//     )
//   }
//   const ListButtonMemoized = React.memo(ListButton)

//   const classes = useStyles()
//   const current = modes.find((e) => e.mode === mode)
//   const buttonList = modes.map((e, i) => (
//     <ListButtonMemoized data={e} key={i} />
//   ))

//   return (
//     <>
//       <Accordion
//         elevation={0}
//         expanded={isExpanded}
//         onChange={() => setExpanded((prev) => !prev)}
//         className={classes.expansionPanel}
//         TransitionProps={{ unmountOnExit: true }}
//       >
//         <Container>
//           <AccordionSummary
//             className={classes.expansionPanelSummary}
//             expandIcon={<ExpandIcon />}
//           >
//             <Typography className={classes.text}>{current.text}</Typography>
//             <Divider />
//           </AccordionSummary>
//         </Container>
//         <AccordionDetails className={classes.expansionPanelDetails}>
//           <List style={{ width: '100%', paddingTop: 0 }}>{buttonList}</List>
//         </AccordionDetails>
//       </Accordion>
//     </>
//   )
// }

export default React.memo(Switcher)
