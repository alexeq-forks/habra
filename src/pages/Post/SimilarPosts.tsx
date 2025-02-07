import React, { useState, useEffect } from 'react'
import { Typography, Paper, Grid, IconButton } from '@material-ui/core'
import BookmarkIconActive from '@material-ui/icons/BookmarkRounded'
import BookmarkIcon from '@material-ui/icons/BookmarkBorderRounded'
import GreenRedNumber from 'src/components/formatters/GreenRedNumber'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { Post } from 'src/interfaces'
import DensePostsSkeleton from 'src/components/skeletons/DensePostsSkeleton'
import getSimilar from 'src/api/getSimilar'
import dayjs from 'dayjs'

interface Props {
  id: number | string
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: 0,
  },
  header: {
    fontFamily: 'Google Sans',
    fontWeight: 800,
    color: theme.palette.primary.main,
    fontSize: 20,
    marginBottom: theme.spacing(1),
  },
  link: {
    textDecoration: 'none',
  },
  post: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: 'flex',
  },
  postTitle: {
    fontFamily: 'Google Sans',
    fontWeight: 500,
    fontSize: 17,
    color: theme.palette.text.primary,
  },
  postTs: {
    color: theme.palette.text.hint,
    fontWeight: 500,
    fontSize: 12,
  },
  postScore: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  error: {
    color: theme.palette.error.light,
    fontWeight: 800,
  },
  divider: {
    height: 32,
    margin: '0 ' + theme.spacing(1) + 'px',
  },
  iconButton: {
    padding: 10,
    marginRight: theme.spacing(1),
    color: (isBookmarked) =>
      isBookmarked ? theme.palette.primary.main : theme.palette.text.hint,
  },
}))

const SimilarPost = ({ data }) => {
  const [isBookmarked, setBookmarkedState] = useState<boolean>(false)
  const classes = useStyles(isBookmarked)
  const { score, id, title, time_published: tsUnparsed } = data
  const ts = dayjs(tsUnparsed).calendar()

  return (
    <Grid className={classes.post}>
      <Grid item>
        <IconButton
          onClick={() => setBookmarkedState((prev) => !prev)}
          className={classes.iconButton}
        >
          {isBookmarked ? <BookmarkIconActive /> : <BookmarkIcon />}
        </IconButton>
      </Grid>
      <Grid item style={{ flexGrow: 1, marginRight: 8 }}>
        <Link to={'/post/' + id} className={classes.link}>
          <Typography className={classes.postTitle}>{title}</Typography>
          <Typography className={classes.postTs}>{ts}</Typography>
        </Link>
      </Grid>
      <Grid item className={classes.postScore}>
        <GreenRedNumber
          style={{ fontWeight: 800, fontFamily: 'Google Sans' }}
          number={score}
        />
      </Grid>
    </Grid>
  )
}

const SimilarPosts = (props: Props) => {
  const { id } = props
  const classes = useStyles()
  const [data, setData] = useState<Post[]>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    const get = async () => {
      try {
        setData((await getSimilar(Number(id))).data)
      } catch (e) {
        console.warn('Could not fetch similar posts:', e.message)
        setError(e.message)
      }
    }
    get()
  }, [id])

  return data && data.length !== 0 ? (
    <Paper elevation={0} className={classes.root}>
      <Typography className={classes.header}>Похожие статьи</Typography>
      {error && (
        <Typography className={classes.error}>
          Произошла ошибка при запросе
        </Typography>
      )}
      {!data && <DensePostsSkeleton n={3} />}
      {data && data.map((e, i) => <SimilarPost data={e} key={i} />)}
    </Paper>
  ) : null
}

export default SimilarPosts
