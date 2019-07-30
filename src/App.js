import React, { Component } from 'react'
import Loader from 'libe-components/lib/blocks/Loader'
import LoadingError from 'libe-components/lib/blocks/LoadingError'
import Grid from 'libe-components/lib/layouts/Grid'
import Slot from 'libe-components/lib/layouts/Slot'
import Hero from 'libe-components/lib/blocks/Hero'
import LibeLaboLogo from 'libe-components/lib/blocks/LibeLaboLogo'
import ArticleMeta from 'libe-components/lib/blocks/ArticleMeta'
import ShareArticle from 'libe-components/lib/blocks/ShareArticle'
import InterTitle from 'libe-components/lib/text-levels/InterTitle'
import Slug from 'libe-components/lib/text-levels/Slug'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'
import moment from 'moment'
import { parseTsv } from 'libe-utils'
import { Parser } from 'html-to-react'

export default class App extends Component {
  /* * * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * * */
  constructor () {
    super()
    this.c = 'lblb-evolution-classement'
    this.state = {
      loading_sheet: false,
      error_sheet: null,
      data_sheet: {}
    }
    this.h2r = new Parser()
    this.fetchSheet = this.fetchSheet.bind(this)
    this.fetchCredentials = this.fetchCredentials.bind(this)
  }

  /* * * * * * * * * * * * * * * * *
   *
   * DID MOUNT
   *
   * * * * * * * * * * * * * * * * */
  componentDidMount () {
    this.fetchCredentials()
    if (this.props.spreadsheet) this.fetchSheet()
  }

  /* * * * * * * * * * * * * * * * *
   *
   * FETCH CREDENTIALS
   *
   * * * * * * * * * * * * * * * * */
  async fetchCredentials () {
    const { api_url } = this.props
    const { format, article } = this.props.tracking
    const api = `${api_url}/${format}/${article}/load`
    try {
      const reach = await window.fetch(api, { method: 'POST' })
      const response = await reach.json()
      const { lblb_tracking, lblb_posting } = response._credentials
      window.lblb_tracking = lblb_tracking
      window.lblb_posting = lblb_posting
      return { lblb_tracking, lblb_posting }
    } catch (error) {
      console.error(`Unable to fetch credentials:`)
      console.error(error)
      return Error(error)
    }
  }

  /* * * * * * * * * * * * * * * * *
   *
   * FETCH SHEET
   *
   * * * * * * * * * * * * * * * * */
  async fetchSheet () {
    this.setState({ loading_sheet: true, error_sheet: null })
    const sheet = this.props.spreadsheet
    try {
      const reach = await window.fetch(this.props.spreadsheet)
      if (!reach.ok) throw reach
      const data = await reach.text()
      const parsedData = parseTsv({
        tsv: data,
        tabParams: { keysLinePos: 0 }
      })
      console.log(parsedData)
      const refinedData = {
        header_bg: parsedData.find(line => line.label === 'header_bg').value,
        header_illustration: parsedData.find(line => line.label === 'header_illustration').value,
        header_text: parsedData.find(line => line.label === 'header_text').value,
        intro_text: parsedData.find(line => line.label === 'intro_text').value,
        desktop_ruler: parsedData.find(line => line.label === 'desktop_ruler').value,
        mobile_ruler: parsedData.find(line => line.label === 'mobile_ruler').value,
        content: parsedData.filter(line => line.label.match(/^block_/))
      }
      this.setState({ loading_sheet: false, error_sheet: null, data_sheet: refinedData })
      return data
    } catch (error) {
      if (error.status) {
        const text = `${error.status} error while fetching : ${sheet}`
        this.setState({ loading_sheet: false, error_sheet: error })
        console.error(text, error)
        return Error(text)
      } else {
        this.setState({ loading_sheet: false, error_sheet: error })
        console.error(error)
        return Error(error)
      }
    }
  }

  /* * * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * * */
  render () {
    const { c, state } = this

    /* Assign classes */
    const classes = [c]
    if (state.loading_sheet) classes.push(`${c}_loading`)
    if (state.error_sheet) classes.push(`${c}_error`)

    /* Load & errors */
    if (state.loading_sheet) return <div className={classes.join(' ')}><div className='lblb-default-apps-loader'><Loader /></div></div>
    if (state.error_sheet) return <div className={classes.join(' ')}><div className='lblb-default-apps-error'><LoadingError /></div></div>

    const { data_sheet: data } = state

    /* Display component */
    return <div className={classes.join(' ')}>

      {/* HEAD */}
      <Grid width={[12, 12, 12]} gutterSize={[2, 1, 1]} noSideGutter showGrid={false}>
        <Slot width={[12, null, null]} className={`${c}__hero ${c}__hero_lg`}>
          <Hero textShadow
            height='11rem'
            bgPosition='top center'
            textPosition='70'
            bgImage={data.header_bg || ''}
            maxContentWidth={48}
            bgColor='#FFFFFF'
            illustration={data.header_illustration || ''}>
            <InterTitle small level={1}>{this.h2r.parse(data.header_text)}</InterTitle>
          </Hero>
        </Slot>
        <Slot width={[null, 12, null]} className={`${c}__hero ${c}__hero_md`}>
          <Hero textShadow
            height='9rem'
            bgPosition='top center'
            textPosition='70'
            bgImage={data.header_bg || ''}
            maxContentWidth={30}
            bgColor='#FFFFFF'
            illustration={data.header_illustration || ''}>
            <InterTitle small level={1}>{this.h2r.parse(data.header_text)}</InterTitle>
          </Hero>
        </Slot>
        <Slot width={[null, null, 12]} className={`${c}__hero ${c}__hero_sm`}>
          <Hero textShadow
            height='7rem'
            bgPosition='top center'
            textPosition='70'
            bgImage={data.header_bg || ''}
            maxContentWidth={30}
            bgColor='#FFFFFF'
            illustration={data.header_illustration || ''}>
            <InterTitle small level={1}>{this.h2r.parse(data.header_text)}</InterTitle>
          </Hero>
        </Slot>
      </Grid>

      {/* SIGNATURE [WIP]: dynamic content */}
      <Grid width={[12, 12, 12]} gutterSize={[2, 1, 1]} showGrid={false}>
        <Slot width={[4, 6, 10]} offset={[3.5, 2.5, 1]}>
          <div className={`${c}__sign ${c}__sign_top`}>
            <LibeLaboLogo />
            <ArticleMeta inline authors={[
              { name: 'Baptiste Bouthier', role: 'author' },
              { name: 'Maxime Fabas', role: 'author' },
              { name: 'Dario Ingiusto', role: 'author' },
            ]}
            publishedOn={parseInt(moment('2019/07/29 10:00', 'YYYY/MM/DD HH:mm').format('x'), 10)} />
          </div>
        </Slot>
      </Grid>

      {/* INTRO */}
      <Grid width={[12, 12, 12]} gutterSize={[2, 1, 1]} showGrid={false}>
        <Slot width={[5, 7, 10]} offset={[3.5, 2.5, 1]} className={`${c}__intro`}>
          <Paragraph big>{this.h2r.parse(data.intro_text)}</Paragraph>
        </Slot>
      </Grid>

      {/* SHARE */}
      <Grid width={[12, 12, 12]} gutterSize={[2, 1, 1]} showGrid={false}>
        <Slot width={[12, 12, 12]} className={`${c}__share`}>
          <ShareArticle short iconsOnly tweet={`Alaphilippe en jaune, la bordure, l'abandon de Pinot, les étapes tronquées dans les Alpes… En un clin d'œil et un seul graphique, revivez la victoire d'Egan Bernal sur le Tour de France %23TDF2019`} />
        </Slot>
      </Grid>

      {/* HEADERS [WIP]: dynamic content */}
      <Grid width={[null, 12, 12]} gutterSize={[2, 1, 1]} showGrid={false} className={`${c}__non-fixed-ruler`}>
        <Slot width={[null, 12, 12]} offset={[null, 0, 0]} className={`${c}__header ${c}__header_md ${c}__header_md`}>
          <img src='https://www.liberation.fr/apps/medias/2019/07/evolution-classement-tdf/mobile/header-no-fixe.svg' />
        </Slot>
      </Grid>
      <Grid width={[12, 12, 12]} gutterSize={[2, 1, 1]} showGrid={false} className={`${c}__fixed-rulers`}>
        <Slot width={[8, null, null]} offset={[2, null, null]} className={`${c}__header ${c}__header_lg`}>
          <img src={`${data.desktop_ruler}?fazefaze`} />
        </Slot>
        <Slot width={[null, 12, 12]} offset={[null, 0, 0]} className={`${c}__header ${c}__header_md ${c}__header_md`}>
          <img src={`${data.mobile_ruler}?fazefaze`} />
        </Slot>
      </Grid>

      {/* CONTENT */}
      <div>{
        (data.content || []).map((line, i) => <Grid key={i} width={[12, 12, 12]} gutterSize={[2, 1, 1]} showGrid={false}>
          <Slot width={[8, null, null]} offset={[2, null, null]} className={`${c}__image ${c}__image_lg`}>
            <img src={`${line.desktop_image}?gazega`} />
          </Slot>
          <Slot width={[null, 12, 12]} offset={[null, 0, 0]} className={`${c}__image ${c}__image_md ${c}__image_sm`}>
            <img src={`${line.mobile_image}?gazefa`} />
          </Slot>
          <Slot width={[8, null, null]} offset={[2, null, null]} className={`${c}__text ${c}__text_lg`}>
            <div className={`${c}__text-bg`} style={{ backgroundImage: line.desktop_bg_image ? `url(${line.desktop_bg_image})` : '' }} />
            <Grid width={[8, null, null]} gutterSize={[2, null, null]} noSideGutter showGrid={false}>
              <Slot width={[5, null, null]} offset={[1.5, null, null]}>
                <Slug>{this.h2r.parse(line.value)}</Slug>
                <Paragraph>{this.h2r.parse(line.text)}</Paragraph>
              </Slot>
            </Grid>
          </Slot>
          <Slot width={[null, 12, 12]} offset={[null, 0, 0]} className={`${c}__text ${c}__text_md ${c}__text_sm`}>
            <div className={`${c}__text-bg`} style={{ backgroundImage: line.mobile_bg_image ? `url(${line.mobile_bg_image})` : '' }} />
            <Grid width={[null, 12, 12]} gutterSize={[null, 1, 1]} noSideGutter showGrid={false}>
              <Slot width={[null, 8, 10]} offset={[null, 2, 1]}>
                <Slug>{this.h2r.parse(line.value)}</Slug>
                <Paragraph>{this.h2r.parse(line.text)}</Paragraph>
              </Slot>
            </Grid>
          </Slot>
        </Grid>)
      }</div>

      {/* SHARE */}
      <Grid width={[12, 12, 12]} gutterSize={[2, 1, 1]} showGrid={false}>
        <Slot width={[12, 12, 12]} className={`${c}__share`}>
          <ShareArticle short iconsOnly tweet={`Alaphilippe en jaune, la bordure, l'abandon de Pinot, les étapes tronquées dans les Alpes… En un clin d'œil et un seul graphique, revivez la victoire d'Egan Bernal sur le Tour de France %23TDF2019`} />
        </Slot>
      </Grid>

      {/* SIGNATURE [WIP]: dynamic content */}
      <Grid width={[12, 12, 12]} gutterSize={[2, 1, 1]} showGrid={false}>
        <Slot width={[5, 8, 10]} offset={[3.5, 2, 1]}>
          <div className={`${c}__sign ${c}__sign-bottom`}>
            <ArticleMeta authors={[
              { name: 'Baptiste Bouthier', role: 'author' },
              { name: 'Dario Ingiusto', role: 'Infographie' },
              { name: 'Maxime Fabas', role: 'Développement' }
            ]}
            publishedOn={parseInt(moment('2019/07/29 10:00', 'YYYY/MM/DD H:m').format('x'), 10)} />
          </div>
        </Slot>
      </Grid>

      {/* LOGO */}
      <Grid width={[12, 12, 12]} gutterSize={[2, 1, 1]} showGrid={false}>
        <Slot width={[12, 12, 12]} className={`${c}__logo`}>
          <LibeLaboLogo />
        </Slot>
      </Grid>
    </div>
  }
}
